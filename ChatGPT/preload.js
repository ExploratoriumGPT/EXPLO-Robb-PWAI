const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// Variable to store available ports
let availablePorts = [];
let port;

// List all available serial ports
SerialPort.list().then(ports => {
    console.log('Available serial ports:');
    ports.forEach(port => {
        console.log(port.path);
    });
    availablePorts = ports.map(port => port.path); // Store available port paths

    if (availablePorts.length === 0) {
        console.log('No available serial ports.');
        return;
    }

    // Use the first available serial port
    port = new SerialPort({ path: availablePorts[0], baudRate: 115200 });
    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    port.on('open', () => {
        console.log('Port opened');
    });

    parser.on('data', (data) => {
        console.log(`Received data: ${data}`);
    });

    port.on('error', (err) => {
        console.log('Error: ', err.message);
    });
}).catch(err => {
    console.error('Error listing ports:', err);
});

window.addEventListener('keydown', (event) => {
    // console.log(`Key pressed: ${event.key}`);
    // If the key is 'Enter', send the message
    if (event.key === 'Enter') {
        console.log('Sending Q to serial port');
        if (!port || !port.isOpen) {
            console.log('Serial port is not open.');
            return;
        }
        port.write('Q\r', (err) => {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            console.log('Message "Q" and CR written');
        });
    }
});