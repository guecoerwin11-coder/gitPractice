const Blog = require('../configs/database')

const getBlogs = async (req, res) => {
    try{
        const syntax = 'SELECT * FROM blogs'

        const result = await Blog.query(syntax);

        const blog = result.rows;

        res.status(200).json(blog)

    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const getBlog = async (req, res) => {
    try{
        const {id} = req.params;

        const syntax = 'SELECT * FROM blogs WHERE id = $1';

        const results = await Blog.query(syntax,[id]);

        if(results.rows.length === 0){
            return res.status(404).json({message: 'blog is not found'})
        }

        const blog = results.rows

        res.status(200).json(blog);

    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const addBlog = async (req, res) => {
    try{
        const {title, content} = req.body;

        const syntax = 'INSERT INTO blogs (title, content) VALUES($1, $2)';

        const results = await Blog.query(syntax, [title, content]);

        res.status(201).json({
            message: 'Blogs Added'
        })
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const updateBlog = async (req, res) => {
    try{
        const {id} = req.params;
        const {title, content} = req.body;

        const syntax = 'UPDATE blogs SET title = $1, content = $2 WHERE id = $3 RETURNING *'

        const results = await Blog.query(syntax, [title, content, id]);

        if(results.rows.length === 0){
            return res.status(404).json({message: 'Blog is not found'})
        }

        const blog = results.rows[0];

        res.status(200).json({message: 'update successful!', data: blog})
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const deleteBlog = async (req, res) => {
    try{
        const { id } = req.params;

        const syntax = 'DELETE FROM blogs WHERE id = $1 RETURNING *';
        const results = await Blog.query(syntax, [id]);

        if(results.rows.length === 0){
            return res.status(404).json({message: 'Blog is not found'})
        }


        res.status(200).json({message: 'Deleted successful!'})

    }catch(err){
        res.status(500).json({message: err.message})
    }
}


module.exports = {
    getBlogs, getBlog, addBlog, updateBlog, deleteBlog
}