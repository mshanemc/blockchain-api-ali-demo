#!/usr/bin/env node

import { Command, flags } from '@oclif/command';
import request = require('request-promise-native');
import moment = require('moment');

class BlockchainDemo extends Command {
  static description = 'describe the command here';

  static flags = {
    // add --version flag to show CLI version
    vin: flags.string({ char: 'v' }),
    username: flags.string({ char: 'u' }),
    endpoint: flags.string({ char: 'e' }),
    password: flags.string({ char: 'p' }),
    namespace: flags.string({ char: 'n' }),
    entity: flags.string({ char: 'o' })
  };

  static args = [{ name: 'file' }];

  async run() {
    const { args, flags } = this.parse(BlockchainDemo);

    const username = flags.username || process.env.SFBC_USERNAME;
    const password = flags.password || process.env.SFBC_PASSWORD;
    const endpoint = flags.endpoint || process.env.SFBC_ENDPOINT;
    const namespace = flags.namespace || process.env.SFBC_NAMESPACE;
    const entity = flags.entity || process.env.SFBC_ENTITY;

    const record = {
      vin: flags.vin,
      description: 'Front Windshield Replacement',
      event_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    console.log(
      `curl -X POST "${flags.endpoint}/services/token" -H  "accept: application/json" -H  "content-type: application/json" -d "{  \"client_id\": \"${flags.username}\",  \"client_secret\": \"${flags.password}\"}"`
    );
    const tokenResponse = await request(`${flags.endpoint}/services/token`, {
      method: 'POST',
      body: {
        client_id: flags.username,
        client_secret: flags.password
      },
      json: true
    });

    this.log(tokenResponse.access_token);
    console.log();

    console.log(
      `curl -X POST "${flags.endpoint}/services/data/${flags.namespace}/${flags.entity}" -H  "Accept: application/json" -H  "Authorization: Bearer ${
        tokenResponse.access_token
      }" -d ${JSON.stringify(record)}"`
    );
    const createResponse = await request(`${flags.endpoint}/services/data/${flags.namespace}/${flags.entity}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`
      },
      body: record,
      json: true
    });

    console.log(createResponse);
  }
}

export = BlockchainDemo;
