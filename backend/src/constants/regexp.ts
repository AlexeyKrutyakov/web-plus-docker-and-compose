const REGEXP = {
  url: /https?:\/\/(www\.)?(?!www)([a-z0-9-.]*)?[a-z0-9-]*\.[a-z-]{2,}(\/)?([a-z0-9-./_]*)?/,
  email: /[a-z0-9-.]{2,}@[a-z0-9-.]*[a-z0-9-]{2,}/,
};

export default REGEXP;
