const categoryModel = require('../models/categoryModels');

const categoryController = {
    getCategories : async (req, res) => {
        try {
            const categories = await categoryModel.find();
            res.json(categories);
        } catch (err) {
            return res.status(500).json({
                msg: err.message
            });
        }
    },
    createCategory : async (req, res) => {
        try {
            const { name } = req.body;
            const existingCategory = await categoryModel.findOne({ name });

            if (existingCategory) {
                return res.status(400).json({
                    msg: "This category already exists."
                });
            }

            const newCategory = new categoryModel({ name });

            await newCategory.save();
            res.json({msg:"Created Category Success"});
        } catch (err) {
            return res.status(500).json({
                msg: err.message
            });
        }
    },
    deleteCategory : async (req,res) => {
        try{
            await categoryModel.findByIdAndDelete(req.params.id);
            res.json({msg:"Deleted Category Success"});
        }catch(err){
            return res.status(500).json({
                msg:err.message
            })
        }
    },
    updateCategory : async (req,res) => {
        try{
            const { name } = req.body;
            const updateCategory = await categoryModel.findByIdAndUpdate({_id:req.params.id},{name});
            
            res.json({msg:"Updated Category Success"});
        }catch(err){
            return res.status(500).json({
                msg:err.message
            });
        }
    }
};

module.exports = categoryController;
