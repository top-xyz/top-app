import axios from 'axios';
import { Logger } from '../utils/logger';

export class ApolloClient {
  private client: any;
  private logger: Logger;
  private baseUrl = 'https://api.apollo.io/v1';

  constructor() {
    this.logger = new Logger();
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.APOLLO_API_KEY}`
      }
    });
  }

  async configure() {
    try {
      // Verify API access
      await this.verifyAccess();

      // Configure email settings
      await this.configureEmail();

      // Set up sequence rules
      await this.configureSequenceRules();

      this.logger.success('Apollo.io configured successfully');
    } catch (error) {
      this.logger.error('Apollo.io configuration failed:', error);
      throw error;
    }
  }

  async setupSequences() {
    try {
      // Create email templates
      await this.createEmailTemplates();

      // Create sequences
      await this.createSequences();

      this.logger.success('Apollo sequences created');
    } catch (error) {
      this.logger.error('Sequence setup failed:', error);
      throw error;
    }
  }

  async enrichContacts() {
    try {
      // Get contacts from HubSpot
      const contacts = await this.getHubSpotContacts();

      // Enrich each contact
      for (const contact of contacts) {
        const enriched = await this.client.post('/people/match', {
          first_name: contact.firstName,
          last_name: contact.lastName,
          organization_name: contact.company,
          email: contact.email
        });

        // Update HubSpot with enriched data
        await this.updateHubSpotContact(contact.id, enriched.data);
      }

      this.logger.success('Contacts enriched successfully');
    } catch (error) {
      this.logger.error('Contact enrichment failed:', error);
      throw error;
    }
  }

  async startOutreach() {
    try {
      // Get active sequences
      const sequences = await this.getActiveSequences();

      // Start sequences for each contact
      for (const sequence of sequences) {
        await this.startSequence(sequence.id);
      }

      this.logger.success('Outreach sequences started');
    } catch (error) {
      this.logger.error('Outreach start failed:', error);
      throw error;
    }
  }

  private async verifyAccess() {
    try {
      const response = await this.client.get('/auth/health');
      if (response.data.status !== 'active') {
        throw new Error('Apollo.io API access not active');
      }
    } catch (error) {
      throw new Error('Failed to verify Apollo.io access');
    }
  }

  private async configureEmail() {
    const config = {
      warm_up: true,
      verification: true,
      tracking: {
        opens: true,
        clicks: true,
        replies: true
      },
      sending_calendar: {
        timezone: 'UTC',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        hours: {
          start: 9,
          end: 17
        }
      }
    };

    await this.client.post('/email/configure', config);
  }

  private async configureSequenceRules() {
    const rules = {
      max_emails_per_day: 25,
      pause_on_reply: true,
      business_hours_only: true,
      local_timezone: true,
      min_delay_between_steps: 3 * 24 * 60 * 60 // 3 days in seconds
    };

    await this.client.post('/sequences/rules', rules);
  }

  private async createEmailTemplates() {
    const templates = [
      {
        name: 'Initial Outreach',
        subject: 'Peek: Revolutionizing screen sharing for {{company}}',
        body: `Hi {{first_name}},

I noticed {{company}}'s focus on {{investment_focus}} and wanted to reach out about Peek.

We're building the next generation of screen sharing:
• 10K+ active users, 40% MoM growth
• 85% gross margin, $1000+ LTV
• Backed by top angels from Figma, Notion

Given your investments in {{portfolio_companies}}, I'd love to chat about how we're transforming this space.

Best,
{{sender_name}}`
      },
      {
        name: 'Traction Update',
        subject: 'Re: Quick update on Peek',
        body: `Hi {{first_name}},

Quick update on our growth since my last email:
• Hit 12K active users (↑20%)
• Launched enterprise beta with 5 Fortune 500 companies
• Featured in TechCrunch's "Startups to Watch"

Would love to share more details. Open to a quick chat?

Best,
{{sender_name}}`
      },
      {
        name: 'Social Proof',
        subject: 'Re: Peek - Customer success story',
        body: `Hi {{first_name}},

Wanted to share a quick win - one of our enterprise customers just reported:

"Peek transformed our client reviews. 50% faster feedback cycles and 2x engagement."

Full case study: peek.so/cases/enterprise

Worth a 30min discussion?

Best,
{{sender_name}}`
      }
    ];

    for (const template of templates) {
      await this.client.post('/email/templates', template);
    }
  }

  private async createSequences() {
    const sequences = [
      {
        name: 'Investor Outreach',
        rules: {
          max_steps: 4,
          min_delay: 3 * 24 * 60 * 60 // 3 days
        },
        steps: [
          {
            type: 'email',
            template: 'Initial Outreach'
          },
          {
            type: 'wait',
            delay: 3 * 24 * 60 * 60
          },
          {
            type: 'email',
            template: 'Traction Update'
          },
          {
            type: 'wait',
            delay: 4 * 24 * 60 * 60
          },
          {
            type: 'email',
            template: 'Social Proof'
          }
        ]
      }
    ];

    for (const sequence of sequences) {
      await this.client.post('/sequences', sequence);
    }
  }

  private async getHubSpotContacts() {
    // This would integrate with your HubSpot client
    // For now, returning mock data
    return [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        company: 'Acme VC',
        email: 'john@acmevc.com'
      }
    ];
  }

  private async updateHubSpotContact(id: string, enrichedData: any) {
    // This would integrate with your HubSpot client
    this.logger.info(`Updated HubSpot contact ${id} with enriched data`);
  }

  private async getActiveSequences() {
    const response = await this.client.get('/sequences', {
      params: {
        status: 'active'
      }
    });
    return response.data.sequences;
  }

  private async startSequence(sequenceId: string) {
    await this.client.post(`/sequences/${sequenceId}/start`);
  }
} 