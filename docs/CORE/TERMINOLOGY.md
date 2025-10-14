# Empowr CRM Terminology Guide

## Core Entities

### 1. **Jobs** 
- **Definition**: Job postings that help us identify companies that are hiring
- **Purpose**: These are the signals that indicate a company has open positions and may need recruitment services
- **Data Source**: Job boards, company websites, LinkedIn job postings
- **Status**: Tracked to identify potential client companies

### 2. **Companies** 
- **Definition**: Organizations that we're trying to sign as clients
- **Purpose**: These are our target prospects - companies that have job openings and may need recruitment services
- **Data Source**: Company databases, LinkedIn company pages, job postings
- **Status**: Tracked through our sales pipeline stages

### 3. **People** 
- **Definition**: Individual contacts at companies who we interact with to close deals
- **Purpose**: These are the decision-makers and influencers we message to secure company contracts
- **Data Source**: LinkedIn profiles, company directories, referrals
- **Status**: Tracked through our communication pipeline stages

## Automation Tools

### External Automation Platforms
- **Expandi**: LinkedIn automation tool for connection requests, messaging, and engagement
- **Prosp**: LinkedIn automation tool for prospecting and outreach
- **Integration**: Both tools handle LinkedIn communication on behalf of our team

## Pipeline Stages

### Company Pipeline Stages
1. **New** - Company identified as potential client
2. **Contacted** - Initial outreach made
3. **Qualified** - Company shows interest
4. **Proposal** - Proposal sent
5. **Negotiation** - Terms being discussed
6. **Closed Won** - Contract signed
7. **Closed Lost** - Opportunity lost

### People Pipeline Stages
1. **New** - Person identified as contact
2. **Connection Requested** - LinkedIn connection request sent
3. **Connected** - LinkedIn connection accepted
4. **Messaged** - Initial message sent
5. **Replied** - Person responded to message
6. **Lead Lost** - Person not interested

## Reporting Metrics

### Key Performance Indicators
- **Total Jobs**: Number of job postings tracked
- **Total Companies**: Number of companies in pipeline
- **Total People**: Number of individual contacts tracked
- **Automation Rate**: Percentage of people with active automation
- **Connection Rate**: Percentage of connection requests accepted
- **Response Rate**: Percentage of messages that received replies
- **Conversion Rate**: Percentage of people who became interested prospects

### Automation Metrics
- **Automation Started**: Number of people with active LinkedIn automation
- **Connection Requests Sent**: Total LinkedIn connection requests sent via Expandi/Prosp
- **Connections Accepted**: Number of LinkedIn connections accepted
- **Messages Sent**: Total messages sent via automation tools
- **Replies Received**: Number of responses received
- **Reply Types**: Interested, Not Interested, Maybe

## Data Flow

```
Jobs → Companies → People → Automation → Responses → Deals
```

1. **Jobs** help us identify **Companies** that are hiring
2. **Companies** are added to our sales pipeline
3. **People** at those companies are identified as contacts
4. **Automation** tools (Expandi/Prosp) handle LinkedIn outreach
5. **Responses** from people indicate interest level
6. **Deals** are closed with interested companies

## Best Practices

### Data Entry
- Always link people to their respective companies
- Track job postings to identify new company opportunities
- Use consistent stage names across all entities
- Update automation status when tools are activated/deactivated

### Reporting
- Focus on conversion rates between stages
- Monitor automation performance metrics
- Track response quality (interested vs not interested)
- Measure time spent in each pipeline stage

### Automation Management
- Coordinate between Expandi and Prosp to avoid duplicate outreach
- Monitor response rates to optimize messaging
- Track which automation tools perform better for different industries
- Ensure compliance with LinkedIn's terms of service
