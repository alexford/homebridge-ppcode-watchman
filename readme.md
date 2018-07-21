## homebridge-ppcode-watchman

A homebridge plugin for the Person Place Code Watchman temperature/humidity sensor. Exposes temperature and relative humidity.

### Installation

`npm install -g homebridge-ppcode-watchman`, then add an accessory entry in your homebridge config file:

````json
{
    "accessory": "PP Code Watchman",
    "name": "Living Room Watchman",
    "product_id": "xxxxxxxxxxxx",
    "host": "192.168.0.103"
}
````

- `product_id` is a 12 digit code printed on the bottom of your Watchman

- `host` is the IP address displayed on the Watchman screen

### More info

Watchman product page: https://personplacecode.com/watchman

API information: https://personplacecode.com/more-info
