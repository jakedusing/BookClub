const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.bookSchema = Joi.object({
  book: Joi.object({
    title: Joi.string().required().escapeHTML(),
    author: Joi.string().required().escapeHTML(),
    // image: Joi.string().required(),
    description: Joi.string().required().escapeHTML(),
    pages: Joi.number().optional().min(0),
    date: Joi.number().optional().min(0),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
