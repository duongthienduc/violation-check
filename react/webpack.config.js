module.exports = function(env) {
  let _env = env || 'dev';

  return require(`./webpack.config.${_env}.js`)
}
