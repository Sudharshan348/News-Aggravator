import mongoose from 'mongoose'

const articleschema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    source: {
        type: String,
        required: true,
        index: true
    },
    publishedAt: {
        type: Date,
        required: true,
        index: true
    },
    content: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: 'general',
        index: true
    },
    urlToImage: {
        type: String
    },
    description: {
        type: String
    }
}, {
    timestamps: true,
    indexes: [
        { title: 'text', content: 'text', description: 'text' },
        { publishedAt: -1 },
        { source: 1, category: 1 }
    ]
})
articleschema.pre('save', async function(next) {
    if (this.isNew) {
        const existing = await this.constructor.findOne({
            $or: [
                { url: this.url },
                { title: this.title }
            ]
        });
        if (existing) {
            const error = new Error('Article already exists');
            error.code = 11000;
            return next(error);
        }
    }
    next();
});

export const Article = mongoose.model("Article", articleschema)