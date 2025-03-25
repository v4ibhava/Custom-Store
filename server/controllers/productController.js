const Products = require('../models/productModels');

// Filter, Sorting and Pagination

class APIfeature{
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
        const queryObj = {...this.queryString}
        const excludedFields = ['page','sort','limit']
        excludedFields.forEach(el => delete(queryObj[el]))
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
        this.query.find(JSON.parse(queryStr))
        return this;
        
    }
    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
            console.log(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }
    pagination(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

const productController = {
    getProduct : async (req, res) => {
        try {
            const features = new APIfeature(Products.find(),req.query).filtering().sorting().pagination()
            const products = await features.query
            res.json(products)
        }catch(err) {
            return res.status(500).json({
                msg: err.message
            })
        }
    },
    createProduct: async (req, res) => {
        try {
          const { product_id, title, price, description, content, images: rawImages, category } = req.body;
      
          // Parse images if sent as JSON string
          const images = typeof rawImages === 'string' ? JSON.parse(rawImages) : rawImages;
      
          if (!images) return res.status(400).json({ msg: "No image Upload" });
      
          // Check for duplicate product_id
          const product = await Products.findOne({ product_id });
          if (product) return res.status(400).json({ msg: "This product already exists." });
      
          // Save new product
          const newProduct = new Products({
            product_id,
            title: title.toLowerCase(),
            price,
            description,
            content,
            images,
            category,
          });
      
          await newProduct.save();
          res.json({ msg: "Created a product", product: newProduct });
        } catch (err) {
          console.error("Error in createProduct:", err);
          return res.status(500).json({ msg: err.message });
        }
      },
    deleteProduct : async (req,res) => {
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({
                msg:"Deleted a product"
            })
        }catch (err) {
            return res.status(500).json({
                msg:err.message
            })
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { product_id, title, price, description, content, images, category } = req.body;
    
            // Validate images
            if (!images) {
                return res.status(400).json({ msg: "No image upload" });
            }
    
            // Perform update
            const updatedProduct = await Products.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    product_id,
                    title: title ? title.toLowerCase() : undefined,
                    price,
                    description,
                    content,
                    images,
                    category,
                },
                { new: true } // Returns the updated product
            );
    
            // Handle product not found
            if (!updatedProduct) {
                return res.status(404).json({ msg: "Product not found" });
            }
    
            res.json({ msg: "Updated a product", product: updatedProduct });
        } catch (err) {
            console.error("Error in updateProduct:", err); 
            return res.status(500).json({ msg: err.message });
        }
    },
    getProductById: async (req,res) => {
        try {
            const product = await Products.findById(req.params.id);
            if (!product) {
                return res.status(404).json({msg: "Product not found"});
            }
            res.json(product);
        }catch(err) {
            console.log("error in getProductById:",err);
            return res.status(500).json({msg: err.message});
        }
    }
    
}

module.exports = productController;