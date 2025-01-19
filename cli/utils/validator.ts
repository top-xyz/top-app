import { Logger } from './logger';
import axios from 'axios';

export class Validator {
  private logger: Logger;
  private requiredEnvVars = [
    'HUBSPOT_API_KEY',
    'HUBSPOT_PORTAL_ID',
    'APOLLO_API_KEY',
    'APOLLO_ORG_ID',
    'CALENDLY_API_KEY',
    'CALENDLY_USER_URI',
    'DOCSEND_API_KEY',
    'DOCSEND_WORKSPACE_ID',
    'DATADOG_API_KEY',
    'DATADOG_APP_KEY'
  ];

  constructor() {
    this.logger = new Logger();
  }

  async verifyAll() {
    this.logger.section('Verifying All Components');

    try {
      await this.verifyEnvironment();
      await this.verifyHubSpot();
      await this.verifyApollo();
      await this.verifyCalendly();
      await this.verifyDocSend();
      await this.verifyDataDog();

      this.logger.success('All verifications passed');
    } catch (error) {
      this.logger.error('Verification failed', error);
      throw error;
    }
  }

  async verifyEnvironment() {
    this.logger.info('Verifying environment variables...');

    const missing = this.requiredEnvVars.filter(
      varName => !process.env[varName]
    );

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`
      );
    }

    this.logger.success('Environment variables verified');
  }

  async validateSetup() {
    this.logger.section('Validating Campaign Setup');

    try {
      // Verify integrations are configured
      await this.verifyIntegrations();

      // Check campaign requirements
      await this.verifyCampaignRequirements();

      // Validate content
      await this.verifyContent();

      this.logger.success('Campaign setup validated');
    } catch (error) {
      this.logger.error('Setup validation failed', error);
      throw error;
    }
  }

  private async verifyHubSpot() {
    this.logger.info('Verifying HubSpot integration...');

    try {
      const response = await axios.get(
        'https://api.hubapi.com/crm/v3/objects/contacts',
        {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`
          }
        }
      );

      if (response.status !== 200) {
        throw new Error('HubSpot API check failed');
      }

      await this.verifyHubSpotPipeline();
      await this.verifyHubSpotProperties();

      this.logger.success('HubSpot integration verified');
    } catch (error) {
      throw new Error(`HubSpot verification failed: ${error.message}`);
    }
  }

  private async verifyApollo() {
    this.logger.info('Verifying Apollo.io integration...');

    try {
      const response = await axios.get(
        'https://api.apollo.io/v1/auth/health',
        {
          headers: {
            Authorization: `Bearer ${process.env.APOLLO_API_KEY}`
          }
        }
      );

      if (response.data.status !== 'active') {
        throw new Error('Apollo.io API check failed');
      }

      await this.verifyApolloSequences();
      await this.verifyApolloTemplates();

      this.logger.success('Apollo.io integration verified');
    } catch (error) {
      throw new Error(`Apollo.io verification failed: ${error.message}`);
    }
  }

  private async verifyCalendly() {
    this.logger.info('Verifying Calendly integration...');

    try {
      const response = await axios.get(
        'https://api.calendly.com/users/me',
        {
          headers: {
            Authorization: `Bearer ${process.env.CALENDLY_API_KEY}`
          }
        }
      );

      if (response.status !== 200) {
        throw new Error('Calendly API check failed');
      }

      await this.verifyCalendlyEvents();

      this.logger.success('Calendly integration verified');
    } catch (error) {
      throw new Error(`Calendly verification failed: ${error.message}`);
    }
  }

  private async verifyDocSend() {
    this.logger.info('Verifying DocSend integration...');

    try {
      const response = await axios.get(
        'https://api.docsend.com/api/workspaces',
        {
          headers: {
            Authorization: `Bearer ${process.env.DOCSEND_API_KEY}`
          }
        }
      );

      if (response.status !== 200) {
        throw new Error('DocSend API check failed');
      }

      await this.verifyDocSendSpaces();
      await this.verifyDocSendContent();

      this.logger.success('DocSend integration verified');
    } catch (error) {
      throw new Error(`DocSend verification failed: ${error.message}`);
    }
  }

  private async verifyDataDog() {
    this.logger.info('Verifying Datadog integration...');

    try {
      const response = await axios.get(
        'https://api.datadoghq.com/api/v1/validate',
        {
          headers: {
            'DD-API-KEY': process.env.DATADOG_API_KEY,
            'DD-APPLICATION-KEY': process.env.DATADOG_APP_KEY
          }
        }
      );

      if (response.status !== 200) {
        throw new Error('Datadog API check failed');
      }

      this.logger.success('Datadog integration verified');
    } catch (error) {
      throw new Error(`Datadog verification failed: ${error.message}`);
    }
  }

  private async verifyIntegrations() {
    const integrations = [
      'HubSpot',
      'Apollo.io',
      'Calendly',
      'DocSend',
      'Datadog'
    ];

    for (const integration of integrations) {
      this.logger.info(`Checking ${integration} configuration...`);
      
      const method = `verify${integration.replace('.', '')}`;
      await this[method]();
    }
  }

  private async verifyCampaignRequirements() {
    const requirements = [
      'Pipeline setup',
      'Email templates',
      'Sequences',
      'Event types',
      'Content spaces'
    ];

    for (const req of requirements) {
      this.logger.info(`Checking ${req}...`);
      // Add specific checks for each requirement
    }
  }

  private async verifyContent() {
    const content = [
      'Pitch deck',
      'Financial model',
      'Case studies',
      'Team bios'
    ];

    for (const item of content) {
      this.logger.info(`Checking ${item}...`);
      // Add specific checks for each content item
    }
  }

  private async verifyHubSpotPipeline() {
    // Verify investment pipeline exists and has correct stages
    const stages = [
      'New Lead',
      'Initial Contact',
      'Meeting Scheduled',
      'Meeting Completed',
      'Due Diligence',
      'Term Sheet',
      'Closed'
    ];

    // Add implementation
  }

  private async verifyHubSpotProperties() {
    // Verify custom properties exist
    const properties = [
      'check_size',
      'investment_focus',
      'portfolio_fit',
      'engagement_score'
    ];

    // Add implementation
  }

  private async verifyApolloSequences() {
    // Verify sequences exist and are configured correctly
    const sequences = [
      'Initial Outreach',
      'Traction Update',
      'Social Proof'
    ];

    // Add implementation
  }

  private async verifyApolloTemplates() {
    // Verify email templates exist
    const templates = [
      'Initial Outreach',
      'Traction Update',
      'Social Proof'
    ];

    // Add implementation
  }

  private async verifyCalendlyEvents() {
    // Verify event types exist
    const events = [
      'Investor Introduction',
      'Follow-up Discussion',
      'Due Diligence'
    ];

    // Add implementation
  }

  private async verifyDocSendSpaces() {
    // Verify spaces exist
    const spaces = [
      'Pitch Materials',
      'Due Diligence'
    ];

    // Add implementation
  }

  private async verifyDocSendContent() {
    // Verify required content exists
    const content = [
      'Pitch Deck',
      'Financial Model',
      'Case Studies'
    ];

    // Add implementation
  }
} 