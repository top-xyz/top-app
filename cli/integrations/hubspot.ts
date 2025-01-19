import { Client } from '@hubspot/api-client';
import { Logger } from '../utils/logger';

export class HubSpotClient {
  private client: Client;
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
    this.client = new Client({ accessToken: process.env.HUBSPOT_API_KEY });
  }

  async configure() {
    try {
      // Verify credentials
      await this.client.oauth.accessTokensApi.get();
      
      // Create custom properties
      await this.createCustomProperties();
      
      // Set up pipeline
      await this.createPipeline();
      
      this.logger.success('HubSpot configured successfully');
    } catch (error) {
      this.logger.error('HubSpot configuration failed:', error);
      throw error;
    }
  }

  async createCampaign() {
    try {
      // Create campaign container
      const campaign = await this.client.marketing.campaigns.basicApi.create({
        name: 'Peek Seed Round',
        type: 'EMAIL',
        scheduledAt: new Date().toISOString()
      });

      // Set up workflows
      await this.setupWorkflows();

      // Create sequences
      await this.createSequences();

      this.logger.success('HubSpot campaign created');
      return campaign;
    } catch (error) {
      this.logger.error('Campaign creation failed:', error);
      throw error;
    }
  }

  async importInvestors() {
    try {
      // Read CSV file
      const investors = await this.readInvestorCSV();

      // Create/update contacts
      for (const investor of investors) {
        await this.client.crm.contacts.basicApi.create({
          properties: {
            email: investor.email,
            firstname: investor.firstName,
            lastname: investor.lastName,
            company: investor.firm,
            check_size: investor.checkSize,
            investment_focus: investor.focus
          }
        });
      }

      this.logger.success('Investors imported to HubSpot');
    } catch (error) {
      this.logger.error('Investor import failed:', error);
      throw error;
    }
  }

  async trackEngagement() {
    try {
      // Set up engagement tracking
      await this.client.crm.properties.coreApi.create('contacts', {
        name: 'engagement_score',
        label: 'Engagement Score',
        type: 'number',
        fieldType: 'number',
        groupName: 'contactinformation'
      });

      // Create engagement scoring workflow
      await this.createEngagementWorkflow();

      this.logger.success('Engagement tracking enabled');
    } catch (error) {
      this.logger.error('Engagement tracking setup failed:', error);
      throw error;
    }
  }

  async startCampaign() {
    try {
      // Activate workflows
      await this.activateWorkflows();

      // Start sequences
      await this.startSequences();

      this.logger.success('HubSpot campaign started');
    } catch (error) {
      this.logger.error('Campaign start failed:', error);
      throw error;
    }
  }

  async openDashboard() {
    try {
      // Create custom dashboard if not exists
      const dashboard = await this.createDashboard();

      // Open dashboard URL
      const url = `https://app.hubspot.com/reports-dashboard/${process.env.HUBSPOT_PORTAL_ID}/dashboard/${dashboard.id}`;
      this.logger.info(`Dashboard URL: ${url}`);
      
      // Open in default browser
      const { exec } = require('child_process');
      exec(`open "${url}"`);
    } catch (error) {
      this.logger.error('Dashboard opening failed:', error);
      throw error;
    }
  }

  private async createCustomProperties() {
    const properties = [
      {
        name: 'check_size',
        label: 'Check Size',
        type: 'string',
        fieldType: 'select',
        options: ['$1M-2M', '$2M-5M', '$5M+']
      },
      {
        name: 'investment_focus',
        label: 'Investment Focus',
        type: 'string',
        fieldType: 'select',
        options: ['Developer Tools', 'Enterprise SaaS', 'Remote Work']
      },
      {
        name: 'portfolio_fit',
        label: 'Portfolio Fit',
        type: 'number',
        fieldType: 'number'
      }
    ];

    for (const prop of properties) {
      await this.client.crm.properties.coreApi.create('contacts', prop);
    }
  }

  private async createPipeline() {
    const stages = [
      'New Lead',
      'Initial Contact',
      'Meeting Scheduled',
      'Meeting Completed',
      'Due Diligence',
      'Term Sheet',
      'Closed'
    ];

    const pipeline = await this.client.crm.pipelines.pipelinesApi.create('deals', {
      label: 'Investment Pipeline',
      stages: stages.map((stage, index) => ({
        label: stage,
        displayOrder: index,
        metadata: {
          probability: (100 - (index * 10)).toString()
        }
      }))
    });

    return pipeline;
  }

  private async setupWorkflows() {
    const workflows = [
      {
        name: 'New Lead Processing',
        type: 'CONTACT_BASED',
        actions: [
          {
            type: 'SET_PROPERTY',
            property: 'lifecyclestage',
            value: 'investor_lead'
          },
          {
            type: 'CREATE_TASK',
            task: {
              subject: 'Review new investor lead',
              body: 'Review profile and determine outreach strategy'
            }
          }
        ]
      },
      {
        name: 'Meeting Follow-up',
        type: 'CONTACT_BASED',
        actions: [
          {
            type: 'DELAY',
            delay: '1 day'
          },
          {
            type: 'SEND_EMAIL',
            email: {
              name: 'Meeting Follow-up'
            }
          }
        ]
      }
    ];

    for (const workflow of workflows) {
      await this.client.automation.workflowsApi.create(workflow);
    }
  }

  private async createSequences() {
    const sequences = [
      {
        name: 'Initial Outreach',
        steps: [
          {
            type: 'EMAIL',
            template: 'initial_outreach'
          },
          {
            type: 'DELAY',
            delay: '3 days'
          },
          {
            type: 'EMAIL',
            template: 'follow_up_1'
          }
        ]
      },
      {
        name: 'Nurture Campaign',
        steps: [
          {
            type: 'EMAIL',
            template: 'monthly_update'
          },
          {
            type: 'DELAY',
            delay: '30 days'
          }
        ]
      }
    ];

    for (const sequence of sequences) {
      await this.client.sequences.sequencesApi.create(sequence);
    }
  }

  private async createEngagementWorkflow() {
    const workflow = {
      name: 'Engagement Scoring',
      type: 'CONTACT_BASED',
      actions: [
        {
          type: 'SCORE',
          property: 'engagement_score',
          conditions: [
            {
              type: 'EMAIL_OPENED',
              score: 1
            },
            {
              type: 'EMAIL_CLICKED',
              score: 2
            },
            {
              type: 'MEETING_BOOKED',
              score: 10
            }
          ]
        }
      ]
    };

    await this.client.automation.workflowsApi.create(workflow);
  }

  private async createDashboard() {
    const dashboard = {
      name: 'Investment Campaign Metrics',
      reports: [
        {
          name: 'Pipeline Overview',
          type: 'deals_by_stage'
        },
        {
          name: 'Engagement Metrics',
          type: 'email_engagement'
        },
        {
          name: 'Meeting Conversion',
          type: 'meetings_booked'
        }
      ]
    };

    return await this.client.reports.dashboardsApi.create(dashboard);
  }

  private async readInvestorCSV() {
    const csv = require('csv-parse');
    const fs = require('fs');
    
    return new Promise((resolve, reject) => {
      const investors = [];
      fs.createReadStream('data/investors.csv')
        .pipe(csv({ columns: true }))
        .on('data', (data) => investors.push(data))
        .on('end', () => resolve(investors))
        .on('error', reject);
    });
  }
} 