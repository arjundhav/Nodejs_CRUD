const app = require('./app');
const express = require('express');
const client = require('prom-client');


// Define the port to listen on
const PORT = process.env.PORT || 3000;
app.use(express.static('./public'));

// Prometheus Metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const counter = new client.Counter({ 
    name: 'type_counter',
    help: 'Any arbitrary value to help identify this counter',
});

const gauge = new client.Gauge({
    name: 'type_gauge',
    help: 'Any arbitrary value to help identify this gauge',
});

const histogram = new client.Histogram({
    name: 'type_histogram',
    help: 'Any arbitrary value to help identify this histogram',
});

const summary = new client.Summary({
    name: 'type_summary',
    help: 'Any arbitrary value to help identify this summary',
});

const metrics = {
    counter,
    gauge,
    histogram,
    summary
};

const handleCounterIncrement = (req, res) => {
    metrics.counter.inc();
    res.send({ message: 'Success' });
};

const handleCounterReset = (req, res) => {
    metrics.counter.reset();
    res.send({ message: 'Success' });
};

const handleGaugeIncrement = (req, res) => {
    metrics.gauge.inc();
    res.send({ message: 'Success' });
};

const handleGaugeDecrement = (req, res) => {
    metrics.gauge.dec();
    res.send({ message: 'Success' });
};

const handleGaugeSetValue = (req, res) => {
    metrics.gauge.set(Number(req.params.value));  // Ensure value is a number
    res.send({ message: 'Success' });
};

const handleHistogramValue = (req, res) => {
    metrics.histogram.observe(Number(req.params.value));  // Ensure value is a number
    res.send({ message: 'Success' });
};

const handleSummaryValue = (req, res) => {
    metrics.summary.observe(Number(req.params.value));  // Ensure value is a number
    res.send({ message: 'Success' });
};

// Define routes for metrics
const metricsRouter = express.Router();
metricsRouter.get('/counter/inc', handleCounterIncrement);
metricsRouter.get('/counter/reset', handleCounterReset);
metricsRouter.get('/gauge/inc', handleGaugeIncrement);
metricsRouter.get('/gauge/dec', handleGaugeDecrement);
metricsRouter.get('/gauge/set/:value', handleGaugeSetValue);
metricsRouter.get('/histogram/:value', handleHistogramValue);
metricsRouter.get('/summary/:value', handleSummaryValue);

// Use the router for Prometheus metrics routes
app.use('/prom', metricsRouter);

// Metrics endpoint
app.use('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', client.register.contentType);
        res.end(await client.register.metrics());
    } catch (ex) {
        res.status(500).end(ex);
    }
});

//Route to index.html for /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// Make the server listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
