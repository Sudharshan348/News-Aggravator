import mongoose from 'mongoose'

const articleschema = new mongoose.Schema({
    title: String,
    url: String,
    source: String,
    publishedAt: String,
    content: String,
},
{timestamps: true})

export const Article = mongoose.model("Article", articleschema)