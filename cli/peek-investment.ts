#!/usr/bin/env node
import { Command } from 'commander';
import { config } from 'dotenv';
import { HubSpotClient } from './integrations/hubspot';
import { ApolloClient } from './integrations/apollo';
import { CalendlyClient } from './integrations/calendly';
import { DocSendClient } from './integrations/docsend';
import { Logger } from './utils/logger';
import { Validator } from './utils/validator';

// Load environment variables
config();

const program = new Command();

// Initialize clients
const hubspot = new HubSpotClient();
const apollo = new ApolloClient();
const calendly = new CalendlyClient();
const docsend = new DocSendClient();
const logger = new Logger();
const validator = new Validator();

program
  .name('peek')
  .description('Peek Investment Campaign CLI')
  .version('1.0.0');

// Campaign Management
program
  .command('campaign')
  .description('Manage investment campaign')
  .option('create', 'Create new campaign')
  .option('start', 'Start campaign')
  .option('pause', 'Pause campaign')
  .option('resume', 'Resume campaign')
  .option('status', 'Check campaign status')
  .action(async (cmd) => {
    try {
      if (cmd.create) {
        await hubspot.createCampaign();
        await apollo.setupSequences();
        await calendly.configureEvents();
        await docsend.createSpaces();
        logger.success('Campaign created successfully');
      } else if (cmd.start) {
        await validator.validateSetup();
        await hubspot.startCampaign();
        await apollo.startOutreach();
        logger.success('Campaign started successfully');
      }
      // ... other campaign actions
    } catch (error) {
      logger.error('Campaign action failed:', error);
    }
  });

// Investor Management
program
  .command('investors')
  .description('Manage investors')
  .option('import', 'Import investors from CSV')
  .option('track', 'Track investor engagement')
  .option('score', 'Score investors')
  .option('segment', 'Segment investors')
  .action(async (cmd) => {
    try {
      if (cmd.import) {
        await hubspot.importInvestors();
        await apollo.enrichContacts();
        logger.success('Investors imported successfully');
      } else if (cmd.track) {
        await hubspot.trackEngagement();
        await docsend.trackViews();
        logger.success('Tracking enabled');
      }
      // ... other investor actions
    } catch (error) {
      logger.error('Investor action failed:', error);
    }
  });

// Content Management
program
  .command('content')
  .description('Manage campaign content')
  .option('upload', 'Upload new content')
  .option('personalize', 'Personalize content')
  .option('track', 'Track content engagement')
  .action(async (cmd) => {
    try {
      if (cmd.upload) {
        await docsend.uploadContent();
        logger.success('Content uploaded successfully');
      } else if (cmd.personalize) {
        await docsend.personalizeContent();
        logger.success('Content personalized');
      }
      // ... other content actions
    } catch (error) {
      logger.error('Content action failed:', error);
    }
  });

// Configuration
program
  .command('configure')
  .description('Configure integrations')
  .option('all', 'Configure all integrations')
  .option('hubspot', 'Configure HubSpot')
  .option('apollo', 'Configure Apollo')
  .option('calendly', 'Configure Calendly')
  .option('docsend', 'Configure DocSend')
  .action(async (cmd) => {
    try {
      if (cmd.all || cmd.hubspot) {
        await hubspot.configure();
      }
      if (cmd.all || cmd.apollo) {
        await apollo.configure();
      }
      if (cmd.all || cmd.calendly) {
        await calendly.configure();
      }
      if (cmd.all || cmd.docsend) {
        await docsend.configure();
      }
      logger.success('Configuration completed');
    } catch (error) {
      logger.error('Configuration failed:', error);
    }
  });

// Verification
program
  .command('verify')
  .description('Verify setup and connections')
  .option('all', 'Verify all integrations')
  .option('env', 'Verify environment')
  .action(async (cmd) => {
    try {
      if (cmd.all) {
        await validator.verifyAll();
      } else if (cmd.env) {
        await validator.verifyEnvironment();
      }
      logger.success('Verification completed');
    } catch (error) {
      logger.error('Verification failed:', error);
    }
  });

// Monitoring
program
  .command('monitor')
  .description('Monitor campaign metrics')
  .option('dashboard', 'Open metrics dashboard')
  .option('alerts', 'Check alerts')
  .action(async (cmd) => {
    try {
      if (cmd.dashboard) {
        await hubspot.openDashboard();
      } else if (cmd.alerts) {
        await hubspot.checkAlerts();
      }
      logger.success('Monitoring initialized');
    } catch (error) {
      logger.error('Monitoring failed:', error);
    }
  });

program.parse(process.argv); 