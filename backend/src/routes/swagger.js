const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

var options = {
    customCss: '.swagger-ui .topbar { display: none }'
};

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

module.exports = router;