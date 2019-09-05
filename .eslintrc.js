module.exports = {
    'extends': ['airbnb-base', 'plugin:prettier/recommended'],
    'plugins': ['prettier'],
    'env': {
        'browser': true,
        'webextensions': true
    },
    'rules': {
        'quotes': [2, 'single', { 'avoidEscape': true }]
    }
}