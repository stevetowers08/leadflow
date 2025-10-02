-- FINAL BATCH SYNC QUERIES - CORRECTED SCHEMA
-- Generated: 2025-10-02T03:35:54.372Z
-- All 505 people with correct dates and automation status

-- SUMMARY:
-- Total people: 505
-- Automated: 107
-- Pending: 398

-- Insert: Collection mohit (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec00K14ZaDrRx7L1', 'Collection mohit', NULL, 'https://www.linkedin.com/in/collection-mohit-82ba96363', 'Sales Manager', 'Australia', 'connection_requested', 'Medium', 'LinkedIn Job Posts', NOW(), 'Love seeing Nothing''s 146% growth in India. That''s incredible momentum.', 'We''re working with some strong sales leaders in the ANZ market at the moment. Happy to chat if useful.', 'I see you''re hiring a Sales Lead for ANZ at Nothing. How are you finding it with all the expansion happening? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec00K14ZaDrRx7L1' 
       OR (LOWER(name) = LOWER('Collection mohit') OR linkedin_url = 'https://www.linkedin.com/in/collection-mohit-82ba96363' )
);
-- Insert: Emma-Jayne Owens (CONNECTED)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec0OJCtqkanR0vxY', 'Emma-Jayne Owens', NULL, 'https://www.linkedin.com/in/ACwAAA1jxUoB8W7J34scDcXBGbzb5Xl7wRASflk', 'RVP Sales - APJ ', 'Greater Sydney Area', 'connected', 'High', 'LinkedIn Job Posts', '2025-09-21T23:31:27.794Z', 'Saw the iPX Sydney event news. That''s exciting growth!', 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Executive hires in Sydney, particularly with companies scaling their partnership teams like impact.com is doing.', '2025-09-20T06:39:07.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec0OJCtqkanR0vxY' 
       OR (LOWER(name) = LOWER('Emma-Jayne Owens') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA1jxUoB8W7J34scDcXBGbzb5Xl7wRASflk' )
);
-- Insert: David Phillips (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec0QFvn5fa8ZcC7y', 'David Phillips', NULL, 'https://www.linkedin.com/in/david-phillips-a6017315', 'Lead Account Manager - Financial Services', 'Melbourne, Australia', 'new', 'Low', '', NULL, 'Saw Simplus featured at the Agentforce World Tour. Great to see you leading the AI transformation space.', 'Hope you''re well! We''re working with some strong Presales candidates in the Salesforce space. Happy to chat if useful.', 'I see the team is hiring a Presales Executive at Simplus. How''s the market looking? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec0QFvn5fa8ZcC7y' 
       OR (LOWER(name) = LOWER('David Phillips') OR linkedin_url = 'https://www.linkedin.com/in/david-phillips-a6017315' )
);
-- Insert: Cameron Fenley (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec0kSyo4N7LWp7uS', 'Cameron Fenley', NULL, 'https://www.linkedin.com/in/ACwAAABMPCwBwtvgbuWS1nwCKDbwXWXM3Dtn4CI', 'Enterprise Strategic Sales ', 'Greater Sydney Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Love seeing SUGCON ANZ coming to Sydney. That''s exciting!', 'We''re working with some excellent SDR candidates focused on new business development at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their ANZ teams.', 'I see you''re building out your SDR team for ANZ new business. How are you finding the talent market in Sydney? We''re noticing some interesting shifts around SDR hiring, particularly with companies expanding their ANZ presence like Sitecore is doing with events like SUGCON.', '2025-10-01T14:15:44.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec0kSyo4N7LWp7uS' 
       OR (LOWER(name) = LOWER('Cameron Fenley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABMPCwBwtvgbuWS1nwCKDbwXWXM3Dtn4CI' )
);
-- Insert: Stephanie French (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec0kd22pifT1Midg', 'Stephanie French', NULL, 'https://www.linkedin.com/in/stephanie-jayne-french', 'Subcontractor Sales Manager', 'Greensborough, Australia', 'new', 'Medium', '', NULL, 'Great to connect Stephanie! Love seeing the growth at E1 across the APAC region.', 'We''re working with some excellent AE candidates across enterprise software.', 'I see you''re building out your team for E1. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in enterprise software.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec0kd22pifT1Midg' 
       OR (LOWER(name) = LOWER('Stephanie French') OR linkedin_url = 'https://www.linkedin.com/in/stephanie-jayne-french' )
);
-- Insert: Anne-Sophie Purtell (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec0koPZSD5QJ1bFe', 'Anne-Sophie Purtell', NULL, 'https://www.linkedin.com/in/ACwAABBLFcoB4kjxzEw-7FhKBEL5DT5YEriMrQk', 'Head of Sales ANZ', 'Australia', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-30T05:18:17.375Z', 'Saw the GBG Go platform launch. Exciting move with the rebrand!', 'We''re working with some excellent senior account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their ANZ operations.', 'I see you''re building out your ANZ team. How are you finding the market for senior account management talent? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales hires in the identity verification space.', '2025-09-29T14:17:00.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec0koPZSD5QJ1bFe' 
       OR (LOWER(name) = LOWER('Anne-Sophie Purtell') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABBLFcoB4kjxzEw-7FhKBEL5DT5YEriMrQk' )
);
-- Insert: Warren Reid (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec0qQAnW80XI17ko', 'Warren Reid', NULL, 'https://www.linkedin.com/in/ACwAAAITVkkBHrOao1Ug57X0mrS78RCvA1BBXok', 'Sales Director', 'Perth, Western Australia, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the new Melbourne office fit out. Great investment in the team!', 'We''re working with some excellent BD candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team with the Business Development Director role. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around BD hires in Melbourne''s tech sector.', '2025-09-23T14:38:19.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec0qQAnW80XI17ko' 
       OR (LOWER(name) = LOWER('Warren Reid') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAITVkkBHrOao1Ug57X0mrS78RCvA1BBXok' )
);
-- Insert: Martin Evans (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec12qIgXB6vOTdsP', 'Martin Evans', NULL, 'https://www.linkedin.com/in/ACwAAAfOYRkB36BcMY5G7qNc7Y1SIVAa7NFISkM', 'Regional Sales Manager', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the Melbourne office presence. Smart local move!', 'We''re seeing some strong customer success talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their renewals teams.', 'Hope you''re settling in well at Lumivero! I see you''re building out the renewals team. How are you finding the local talent market? We''re noticing some interesting shifts in the customer success landscape, particularly around renewals manager hires in the data analytics space.', '2025-09-30T14:13:40.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec12qIgXB6vOTdsP' 
       OR (LOWER(name) = LOWER('Martin Evans') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAfOYRkB36BcMY5G7qNc7Y1SIVAa7NFISkM' )
);
-- Insert: Nick Bowden (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec1M3yBI49uSQTGT', 'Nick Bowden', NULL, 'https://www.linkedin.com/in/ACwAAASE0GwBUTqx4FSOSdFRRRxeCATs7hyPi6M', 'Regional Vice President, Strategic | Enterprise ANZ at Elastic', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Tech Data partnership announcement. Great move for ANZ!', 'We''re working with some excellent enterprise AEs with government experience at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their public sector teams.', 'I see you''re building out your federal government team. How are you finding the talent market for enterprise AEs in that space? We''re noticing some interesting shifts around government sector sales hiring, particularly with companies expanding their public sector focus.', '2025-09-20T14:29:06.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec1M3yBI49uSQTGT' 
       OR (LOWER(name) = LOWER('Nick Bowden') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAASE0GwBUTqx4FSOSdFRRRxeCATs7hyPi6M' )
);
-- Insert: Sumit Bansal (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec1NpANJAnAPPojx', 'Sumit Bansal', NULL, 'https://www.linkedin.com/in/ACwAAAAD1-4Bv2H3r1qIqN3e8o1YLI2l5S_zaQ8', 'Vice President of Sales, Asia', 'Singapore, Singapore', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the new Sydney office at Australia Square. That''s exciting growth!', 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in cybersecurity. The demand for experienced AEs who can navigate complex enterprise sales cycles has really picked up lately.', '2025-09-22T14:21:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec1NpANJAnAPPojx' 
       OR (LOWER(name) = LOWER('Sumit Bansal') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAD1-4Bv2H3r1qIqN3e8o1YLI2l5S_zaQ8' )
);
-- Insert: Brendan Irwin (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec1OBrIhuK084uFV', 'Brendan Irwin', NULL, 'https://www.linkedin.com/in/ACwAABB8F40BVkrydHCArjZg8jbmcObPWculdeQ', 'Country Manager, Australia & New Zealand', 'Sydney, Australia', 'new', 'High', '', NULL, 'Saw the AI platform launches at Birdeye. Love seeing the innovation in hyperlocal marketing.', 'We''re working with some strong SDR candidates in the AI space at the moment. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in AI and marketing tech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec1OBrIhuK084uFV' 
       OR (LOWER(name) = LOWER('Brendan Irwin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABB8F40BVkrydHCArjZg8jbmcObPWculdeQ' )
);
-- Insert: Nicola Gerber (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec1evCimTBK0iOGL', 'Nicola Gerber', NULL, 'https://www.linkedin.com/in/ACwAAABQq6MBZVWnEzmK0yv9eztk4sqdrwGrToA', 'Vice President, AsiaPacific and Japan', 'Singapore', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-21T23:25:19.832Z', 'Saw the Nueva partnership announcement. Great move expanding in Sydney!', 'We''re working with some excellent Enterprise AE candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during local expansion phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in Sydney. With all the partnership activity and the Xcelerate event coming up, must be an exciting time to be scaling locally. I run Launchpad, APAC''s largest invite-only GTM leader community, and also help companies like yours build exceptional teams through 4Twenty Consulting. Would love to chat about what we''re seeing in the market.', '2025-09-20T06:26:48.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec1evCimTBK0iOGL' 
       OR (LOWER(name) = LOWER('Nicola Gerber') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABQq6MBZVWnEzmK0yv9eztk4sqdrwGrToA' )
);
-- Insert: Chloe Frost (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec1hqDZyU1fwF7wj', 'Chloe Frost', NULL, 'https://www.linkedin.com/in/ACwAAATOy8oBGBIxKGKvs2pKBnzsUUPqxI1fb04', 'Senior Sales Director - APAC, at Info-Tech Research Group', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love what Info-Tech is doing across APAC. Hope you''re well!', 'We''re working with some excellent account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their client-facing teams.', 'I see you''re building out your team. How are you finding the talent market across the region? We''re noticing some interesting shifts around account management hires in IT services, particularly with the demand for digital transformation expertise.', '2025-09-25T03:27:03.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec1hqDZyU1fwF7wj' 
       OR (LOWER(name) = LOWER('Chloe Frost') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATOy8oBGBIxKGKvs2pKBnzsUUPqxI1fb04' )
);
-- Insert: Ryan Joseph Rialp (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec1lVxqstS6qCJyj', 'Ryan Joseph Rialp', NULL, 'https://www.linkedin.com/in/ACwAACJ6uycBCpbyzgJntKJOIKEOtPHYnno1LXs', 'Senior Manager', 'Greater Melbourne Area', 'in queue', 'Medium', 'LinkedIn Job Posts', '2025-09-25T02:33:36.427Z', 'Love seeing Nightingale''s success with Victorian care providers!', 'We''re working with some excellent BDR candidates who understand the care sector at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in regulated industries.', 'I see you''re building out your team. How are you finding the market for BDR talent in the care management space? We''re noticing some interesting shifts in the talent market, particularly around sales roles in the NDIS and aged care sectors. The regulatory changes seem to be driving a lot of demand for platforms like yours.', '2025-09-23T14:28:29.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec1lVxqstS6qCJyj' 
       OR (LOWER(name) = LOWER('Ryan Joseph Rialp') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACJ6uycBCpbyzgJntKJOIKEOtPHYnno1LXs' )
);
-- Insert: Christina Chung (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec1mOrlAay4bo519', 'Christina Chung', NULL, 'https://www.linkedin.com/in/christina-chung', 'Head of Business Development - Australia & New Zealand', 'Sydney, Australia', 'new', 'High', '', NULL, 'Saw the news about the $1 billion Series K. Congrats on the massive milestone!', 'We''re working with some strong Engagement Manager candidates with consulting backgrounds.', 'I see you''re hiring an Engagement Manager in Sydney at Databricks. How are you finding it with all the growth? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec1mOrlAay4bo519' 
       OR (LOWER(name) = LOWER('Christina Chung') OR linkedin_url = 'https://www.linkedin.com/in/christina-chung' )
);
-- Insert: Jordan K. (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec1rEmTGHA8l4ypj', 'Jordan K.', NULL, 'https://www.linkedin.com/in/ACwAAATy2SQBPzgGAyPa95PZxVbr_8UIedh-a7M', 'Sales Director', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the platform updates for the Aged Care Bill changes. Smart move getting ahead of July 2025.', 'We''re working with some strong BDR candidates in healthcare tech at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.', 'I see you''re building out your team. How are you finding the aged care tech market? We''re noticing some interesting shifts in the talent landscape, particularly around BDR hires in healthcare software.', '2025-09-18T20:57:16.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec1rEmTGHA8l4ypj' 
       OR (LOWER(name) = LOWER('Jordan K.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATy2SQBPzgGAyPa95PZxVbr_8UIedh-a7M' )
);
-- Insert: Daniel Corridon (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec1sriUFAMAjIY1p', 'Daniel Corridon', NULL, 'https://www.linkedin.com/in/ACwAABBxrngBGEbkNtq6m9iih8UN7r0XG6R7sdo', 'Director of GTM - Enterprise', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the $27.5M Series A news. That''s exciting growth!', 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams quickly.', 'I see you''re building out your SDR team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent landscape, particularly around sales development hires in the construction tech space. With your team doubling from 70 to 140 people, I imagine you''re seeing the challenges firsthand. Would love to chat about what we''re seeing in the market.', '2025-09-20T06:19:41.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec1sriUFAMAjIY1p' 
       OR (LOWER(name) = LOWER('Daniel Corridon') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABBxrngBGEbkNtq6m9iih8UN7r0XG6R7sdo' )
);
-- Insert: Sharryn Napier (She/Her) (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec1zDHjb3DIvNsqs', 'Sharryn Napier (She/Her)', NULL, 'https://www.linkedin.com/in/ACwAAABBiewBkXeaLKsSk49j4wmiGc3DeZqZMfU', 'Vice President, Asia Pacific, India, Japan & China', 'Balgowlah Heights, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Australian data residency launch. That''s huge for enterprise!', 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.', 'I see you''re building out your enterprise team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales hires in the tech sector. The data residency launch must be opening up some exciting opportunities with regulated industries.', '2025-09-28T14:40:06.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec1zDHjb3DIvNsqs' 
       OR (LOWER(name) = LOWER('Sharryn Napier (She/Her)') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABBiewBkXeaLKsSk49j4wmiGc3DeZqZMfU' )
);
-- Insert: Chris Haylock (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec1zg6dNH94IPduv', 'Chris Haylock', NULL, 'https://www.linkedin.com/in/ACwAAAAzhbMBH8Iy2y3097UEVhbWdKiokK5or6A', 'Head of Strategy & Business Development', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Clever AI Data Analyst launch in Sydney. That''s exciting!', 'We''re working with some excellent technical sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during product launch phases.', 'Hope you''re well Chris! I see you''re building out your sales team. How are you finding the local talent market? We''re noticing some interesting shifts in the fintech space, particularly around technical sales hires with your new AI product launch. I run Launchpad, APAC''s largest invite-only GTM leader community, and also help companies like yours scale their sales teams through 4Twenty Consulting. Would love to chat about what we''re seeing in the market.', '2025-09-25T05:16:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec1zg6dNH94IPduv' 
       OR (LOWER(name) = LOWER('Chris Haylock') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAzhbMBH8Iy2y3097UEVhbWdKiokK5or6A' )
);
-- Insert: Jothi Kumar (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec1zoRpvOVDSxxMx', 'Jothi Kumar', NULL, 'https://www.linkedin.com/in/jothikumar79', 'Global Sales Leader - Emerging Regions / APAC', 'Sydney, Australia', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), 'Saw the Forrester Wave recognition. Congrats on being named a Leader!', 'We''re working with some solid partner sales candidates across APAC. Happy to chat if useful.', 'I see you''re hiring a Partner Sales Manager ANZ at Atlassian. How are you finding the market? We work with companies like HubSpot on similar partner roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec1zoRpvOVDSxxMx' 
       OR (LOWER(name) = LOWER('Jothi Kumar') OR linkedin_url = 'https://www.linkedin.com/in/jothikumar79' )
);
-- Insert: Bharani Iyer (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec21j6M2JF4v640k', 'Bharani Iyer', NULL, 'https://www.linkedin.com/in/bharani-iyer-74335a1', 'Vice President and Business Unit Head for Diversified Industries HCL ANZ', 'Melbourne, Australia', 'new', 'High', '', NULL, 'Congrats on HCLTech being recognised as Dell Technologies'' 2025 Global Alliances AI Partner of the Year! That''s fantastic news.', 'We''re working with some excellent Sales Director candidates across enterprise software if you''re looking externally.', 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in enterprise software.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec21j6M2JF4v640k' 
       OR (LOWER(name) = LOWER('Bharani Iyer') OR linkedin_url = 'https://www.linkedin.com/in/bharani-iyer-74335a1' )
);
-- Insert: Adriana De Souza (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec2HdUTDiLfyeGdO', 'Adriana De Souza', NULL, 'https://www.linkedin.com/in/ACwAAA6MOgYBhmR8sBQsZP51f4zuWG5S3AKbZM4', 'Director of GTM Operations', 'Melbourne, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the $27.5M Series A news. That''s exciting growth!', 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases like yours.', 'I see you''re building out your SDR team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent landscape, particularly around sales development hires in the construction tech space. With Sitemate doubling the team locally, I imagine you''re seeing the competition for quality SDRs firsthand.', '2025-09-20T06:19:41.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec2HdUTDiLfyeGdO' 
       OR (LOWER(name) = LOWER('Adriana De Souza') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA6MOgYBhmR8sBQsZP51f4zuWG5S3AKbZM4' )
);
-- Insert: Andrew Fogarty (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec2YeOIJ3zn0fUMm', 'Andrew Fogarty', NULL, 'https://www.linkedin.com/in/andrew-fogarty-30a50616', 'Regional Sales Director', 'Sydney, Australia', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), 'Saw the news about your CRM hitting $100M run rate. That''s exciting!', 'We''re working with some strong SDR Manager candidates at the moment.', 'I see you''re hiring an SDR Manager at monday.com. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec2YeOIJ3zn0fUMm' 
       OR (LOWER(name) = LOWER('Andrew Fogarty') OR linkedin_url = 'https://www.linkedin.com/in/andrew-fogarty-30a50616' )
);
-- Insert: Pamela Ong (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec2d48SihMgn9YpE', 'Pamela Ong', NULL, 'https://www.linkedin.com/in/ACwAAA7fXHMBV3-4aX6TzAEMzoUT5hp76T_3zYQQ', 'Country Manager, Singapore and Asia', 'Singapore', 'in queue', 'High', 'LinkedIn Job Posts', '2025-09-23T06:53:18.097Z', 'Saw the ESET Connect 2025 launch. Love the partner enablement focus!', 'We''re working with some excellent channel sales professionals at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their partner programs.', 'I see you''re building out your channel team. How are you finding the talent market for channel sales roles? We''re noticing some interesting shifts in the market, particularly around experienced channel account managers who understand both the technical and relationship sides of cybersecurity partnerships.', '2025-09-22T14:17:18.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec2d48SihMgn9YpE' 
       OR (LOWER(name) = LOWER('Pamela Ong') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA7fXHMBV3-4aX6TzAEMzoUT5hp76T_3zYQQ' )
);
-- Insert: Peter Scott (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec2kkHX0gKQ4fXC7', 'Peter Scott', NULL, 'https://www.linkedin.com/in/ACwAABxsBr0BgdzzgxhrmBZaXkisQrQ6kqdOLVA', 'Country Lead', 'Greater Melbourne Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Nueva partnership announcement. Great move for the Sydney market!', 'We''re working with some excellent Enterprise AE candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in Sydney. With all the partnership activity and growth happening at Fastly locally, I imagine you''re seeing increased demand for top performers.', '2025-09-20T06:26:49.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec2kkHX0gKQ4fXC7' 
       OR (LOWER(name) = LOWER('Peter Scott') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABxsBr0BgdzzgxhrmBZaXkisQrQ6kqdOLVA' )
);
-- Insert: Ben Luke (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec3Ad9QAqMUTScTf', 'Ben Luke', NULL, 'https://www.linkedin.com/in/ACwAAAgVxQcBmjd5aASGoXWgSi6eqNRYGqlPnAA', 'Senior General Manager - Business Sales (Australia & NZ)', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the new warranty launch for the Arizona printers. That''s exciting!', 'We''re working with some excellent enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out their sales teams.', 'I see Canon''s been expanding the Melbourne team lately. How are you finding the local talent market? We''re noticing some interesting shifts around enterprise sales hires, particularly with companies scaling their production printing divisions. The market''s been quite active for AE roles.', '2025-09-20T06:29:30.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec3Ad9QAqMUTScTf' 
       OR (LOWER(name) = LOWER('Ben Luke') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAgVxQcBmjd5aASGoXWgSi6eqNRYGqlPnAA' )
);
-- Insert: Joe Widing (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec3RqQ4jP82lbaGz', 'Joe Widing', NULL, 'https://www.linkedin.com/in/ACwAAA9XAa4B7EqiXQUQpM4HnNUis0xM2_jb0so', 'Strategic Sales Director', 'Melbourne, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Melbourne office launch! Exciting move into APAC.', 'We''re working with some excellent sales talent in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC operations.', 'Hope you''re settling in well with the new Melbourne office setup! How are you finding the local talent market as you build out the team? We''re seeing some interesting shifts around sales director and AE hires in the region, particularly with US companies expanding their APAC presence.', '2025-09-20T14:16:51.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec3RqQ4jP82lbaGz' 
       OR (LOWER(name) = LOWER('Joe Widing') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA9XAa4B7EqiXQUQpM4HnNUis0xM2_jb0so' )
);
-- Insert: Mike Hawley (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec40mD2H9KCU0gAV', 'Mike Hawley', NULL, 'https://www.linkedin.com/in/devicie', 'Sales Director', 'Brisbane, Australia', 'new', 'Medium', '', NULL, 'Saw the Microsoft Edge reporting connector launch. That''s exciting progress with the partnerships.', 'We''re working with some strong Solutions Engineers in the cybersecurity space.', 'I see you''re hiring Solutions Engineers at Devicie. How are you finding it with the team expansion? We work with companies like HubSpot on similar technical roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec40mD2H9KCU0gAV' 
       OR (LOWER(name) = LOWER('Mike Hawley') OR linkedin_url = 'https://www.linkedin.com/in/devicie' )
);
-- Insert: Charlotte Buxton (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec44Gkgf3MFl7oDt', 'Charlotte Buxton', NULL, 'https://www.linkedin.com/in/ACwAAAtZsYgBHap28_PCkeYpoWUf5Cn2X9W7PlE', 'Enterprise Sales Manager', 'Melbourne, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love seeing JustCo''s Sydney expansion with King Street and Pitt Street!', 'We''re working with some excellent Sales Executive candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in competitive markets.', 'I see you''re building out your sales team. How are you finding the talent market in Sydney? We''re noticing some interesting shifts around Sales Executive hires in the coworking space, particularly with companies scaling their enterprise solutions like JustCo.', '2025-09-25T04:46:17.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec44Gkgf3MFl7oDt' 
       OR (LOWER(name) = LOWER('Charlotte Buxton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAtZsYgBHap28_PCkeYpoWUf5Cn2X9W7PlE' )
);
-- Insert: Julia Ren (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec44K9sjaC3bD2V0', 'Julia Ren', NULL, 'https://www.linkedin.com/in/ACwAAADh_D0BNBHCUg4PhpfLENYwiBmXx__Gd4A', 'General Manager, Greater China', 'Sydney, Australia', 'new', 'High', '', NULL, 'Saw the Top Global Consumer Trends 2025 whitepaper. Great insights on changing market dynamics.', 'We''re working with some strong Business Development candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Business Development hires in data and insights companies.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec44K9sjaC3bD2V0' 
       OR (LOWER(name) = LOWER('Julia Ren') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADh_D0BNBHCUg4PhpfLENYwiBmXx__Gd4A' )
);
-- Insert: Lawrence Tso (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec47pVJsMkXTGu2d', 'Lawrence Tso', NULL, 'https://www.linkedin.com/in/ACwAAAqqoboBrfkUw34a8QY7yN-j2WrcMwEV2VI', 'Senior Sales Manager, Rocket Software', 'Greater Melbourne Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the COBOL Day Sydney event. Great local engagement!', 'We''re working with some excellent AE candidates in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Executive hires in Sydney, especially with all the enterprise modernisation activity happening.', '2025-09-21T14:15:19.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec47pVJsMkXTGu2d' 
       OR (LOWER(name) = LOWER('Lawrence Tso') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAqqoboBrfkUw34a8QY7yN-j2WrcMwEV2VI' )
);
-- Insert: Ross F. (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec4RI186zcGpWoGT', 'Ross F.', NULL, 'https://www.linkedin.com/in/ACwAAA0-WuEBXO7QWVqrHhZ4M-AZoRGTqK7ymDQ', 'Senior Director, JAPAC [Corporate Sales] SMB + Mid Market', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the data residency launch in Australia. Big win for enterprises!', 'We''re working with some excellent enterprise AEs at the moment who understand the regulated sector well. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.', 'Hope you''re well Ross! The data residency launch must be opening up some serious conversations with regulated enterprises. How are you finding the response from banking and government prospects? We''re seeing a lot of movement in enterprise sales teams as companies gear up for these compliance-driven opportunities. The shift toward local cloud deployment is creating some interesting hiring patterns across the market.', '2025-09-28T14:40:07.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec4RI186zcGpWoGT' 
       OR (LOWER(name) = LOWER('Ross F.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA0-WuEBXO7QWVqrHhZ4M-AZoRGTqK7ymDQ' )
);
-- Insert: Rheniel Ibalio (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec4Relc9xy8sSDpP', 'Rheniel Ibalio', NULL, 'https://www.linkedin.com/in/ACwAAAzJKloBvrV5a623LPRHbs6_FSEgvwRYUew', 'Mid Market Account Executive', 'Greater Sydney Area, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the BoxWorks AI launch news. Love seeing the strategic shift to AI automation.', 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your Enterprise AE team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in SaaS.', '2025-09-17T14:26:33.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec4Relc9xy8sSDpP' 
       OR (LOWER(name) = LOWER('Rheniel Ibalio') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAzJKloBvrV5a623LPRHbs6_FSEgvwRYUew' )
);
-- Insert: Natasha Pennells (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec4SBW8m2Mi4yFjs', 'Natasha Pennells', NULL, 'https://www.linkedin.com/in/ACwAAAk3d34BQkLx9HB_l1nwazHOwj8zNZb2Dp0', 'Sales Operations Team Lead', 'Greater Brisbane Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Love the AI-powered LMS updates. Great innovation!', 'We''re working with some excellent B2B sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.', 'I see you''re building out your sales team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around B2B sales hires in edtech. The demand for people who understand both SaaS sales and the education sector seems to be really picking up in Brisbane.', '2025-09-23T14:41:11.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec4SBW8m2Mi4yFjs' 
       OR (LOWER(name) = LOWER('Natasha Pennells') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAk3d34BQkLx9HB_l1nwazHOwj8zNZb2Dp0' )
);
-- Insert: Myron Stein (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec4bXgbw2X1qTZRL', 'Myron Stein', NULL, 'https://www.linkedin.com/in/ACwAAAZIOwEB2WvSyiTux-O-rFO3nDXu-Gvqnos', 'Head of Enterprise Sales ANZ', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Stripe Tour Sydney event. That Stripe Capital launch looks exciting!', 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams in this market.', 'Hope you''re settling in well at Stripe! I see you''re building out the SDR team. How are you finding the local talent market? We''re noticing some interesting shifts in the market, particularly around SDR hires in fintech. The growth you''re seeing with over a million users locally must be creating some exciting opportunities.', '2025-09-28T04:02:05.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec4bXgbw2X1qTZRL' 
       OR (LOWER(name) = LOWER('Myron Stein') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAZIOwEB2WvSyiTux-O-rFO3nDXu-Gvqnos' )
);
-- Insert: Chris Smith (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec4hc6wNFQQXaX7V', 'Chris Smith', NULL, 'https://www.linkedin.com/in/ACwAABm6ASEBzzBzDZ_yvRylPSt2GwsT-fZzyig', 'SVP & Managing Director (Schneider Elec Company)', 'Brisbane, Queensland, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the WestConnex and Sydney Metro wins. Impressive local growth!', 'We''re working with some excellent sales talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC teams.', 'I see you''re building out your team across APAC. How are you finding the local talent market? We''re noticing some interesting shifts in the sales landscape, particularly around enterprise sales hires in Sydney. The infrastructure tech space seems to be heating up with all the major projects happening.', '2025-09-28T03:51:29.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec4hc6wNFQQXaX7V' 
       OR (LOWER(name) = LOWER('Chris Smith') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABm6ASEBzzBzDZ_yvRylPSt2GwsT-fZzyig' )
);
-- Insert: Crispin Kerr (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec4scUKzjZ3jLifP', 'Crispin Kerr', NULL, 'https://www.linkedin.com/in/ACwAAABTqNsBl_XPBoNJeSKyvLMlvefUr6L6hKY', 'Area Vice President, ANZ', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Proofpoint Protect Tour in Sydney. Great inaugural event!', 'We''re working with some excellent BDR candidates in the cybersecurity space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their business development teams.', 'I see you''re building out your BDR team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around business development hires in cybersecurity. The demand for quality BDRs who understand the security space has really picked up since your Sydney event.', '2025-09-23T14:35:43.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec4scUKzjZ3jLifP' 
       OR (LOWER(name) = LOWER('Crispin Kerr') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABTqNsBl_XPBoNJeSKyvLMlvefUr6L6hKY' )
);
-- Insert: James Ross (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec5GbWrYQysZNviw', 'James Ross', NULL, 'https://www.linkedin.com/in/ACwAAABYri0B4I-oxo8ZDk1JZfJ7jLr04ssQO3I', 'RVP - Regional Vice President, ANZ', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Sydney partner bootcamps. Great local expansion!', 'We''re working with some excellent Account Executive candidates in the identity security space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise sales teams.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent market, particularly around Account Executive hires in identity security. The demand for experienced AEs who understand enterprise cybersecurity is really heating up in Sydney.', '2025-09-23T14:16:09.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec5GbWrYQysZNviw' 
       OR (LOWER(name) = LOWER('James Ross') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABYri0B4I-oxo8ZDk1JZfJ7jLr04ssQO3I' )
);
-- Insert: Steve Grubmier (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec5L4zgPoF9LgclG', 'Steve Grubmier', NULL, 'https://www.linkedin.com/in/ACwAAAo2lo0BPOe8g0ui3dmfbZovRdes1vmCeDM', 'Director of Partner Connect APAC', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw MRI''s Melbourne hiring push. Exciting growth phase!', 'We''re working with some excellent Account Manager candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams during growth phases like this.', 'I see you''re building out the sales team in Melbourne. How are you finding the local talent market? We''re noticing some interesting shifts around Account Manager and sales hires in proptech, especially with all the APAC expansion happening. The Anacle acquisition seems to be driving some serious growth momentum across the region.', '2025-09-21T14:12:55.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec5L4zgPoF9LgclG' 
       OR (LOWER(name) = LOWER('Steve Grubmier') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAo2lo0BPOe8g0ui3dmfbZovRdes1vmCeDM' )
);
-- Insert: Matt Davison (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec5ORnkmQy4WQxyy', 'Matt Davison', NULL, 'https://www.linkedin.com/in/ACwAAAfKVC0BSk2eB6jmnlN_gjKX3Zv91odoDk4', 'Senior Client Executive', 'Sydney, New South Wales, Australia', 'new', 'High', '', NULL, 'Saw the Toustone acquisition news. Great move expanding into data analytics!', 'We''re working with some excellent sales professionals in the resources tech sector at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around sales hires in the mining and resources tech space.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec5ORnkmQy4WQxyy' 
       OR (LOWER(name) = LOWER('Matt Davison') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAfKVC0BSk2eB6jmnlN_gjKX3Zv91odoDk4' )
);
-- Insert: Greg Baxter (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec5SLGtXoTU7ohh5', 'Greg Baxter', NULL, 'https://www.linkedin.com/in/ACwAAACtdcYBhlO8gs2rAxPPi2sJ1Rf-ruf2Q70', 'Sales Manager', 'Greater Brisbane Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the SUGCON ANZ 2025 news. Sydney''s going to be buzzing!', 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their ANZ teams.', 'I see you''re focused on new business across ANZ. How are you finding the market at the moment? We''re noticing some interesting shifts in the talent space, particularly around SDR hires in the tech sector. With events like SUGCON coming up, there seems to be renewed energy in the local market.', '2025-10-01T14:15:44.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec5SLGtXoTU7ohh5' 
       OR (LOWER(name) = LOWER('Greg Baxter') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACtdcYBhlO8gs2rAxPPi2sJ1Rf-ruf2Q70' )
);
-- Insert: Kylie Green (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec5g7FeTjD7aCmH5', 'Kylie Green', NULL, 'https://www.linkedin.com/in/ACwAAAqg3lMBsYSUyVow2jTs08Rd2LNJqr6Ytuw', 'Managing Director - APAC', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Australia Square Plaza office setup. Great Sydney base!', 'We''re working with some excellent AE candidates in the employee engagement space at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out their Sydney teams.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Executive hires in the employee engagement space, particularly with companies scaling their Sydney operations.', '2025-09-28T14:25:24.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec5g7FeTjD7aCmH5' 
       OR (LOWER(name) = LOWER('Kylie Green') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAqg3lMBsYSUyVow2jTs08Rd2LNJqr6Ytuw' )
);
-- Insert: Trent McCreanor (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec66RaPyoqSHx05F', 'Trent McCreanor', NULL, 'https://www.linkedin.com/in/ACwAABAtl1sBKMWjbLJW05P3pX_vznUl-AFj5UI', 'Global Head of Sales', 'Gold Coast, Queensland, Australia', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-21T23:24:56.232Z', 'Saw the Sydney customer event news. Love the local focus!', 'We''re working with some excellent BDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your BDR team. How are you finding the local talent market? We''re noticing some interesting shifts around sales development hiring in Sydney, particularly with the infrastructure boom happening across NSW.', '2025-09-20T06:20:34.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec66RaPyoqSHx05F' 
       OR (LOWER(name) = LOWER('Trent McCreanor') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABAtl1sBKMWjbLJW05P3pX_vznUl-AFj5UI' )
);
-- Insert: Jonathan Chua (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec69HmRrMRNvDwJV', 'Jonathan Chua', NULL, 'https://www.linkedin.com/in/ACwAABsOXUsB-1py8q8LNvzMdsvxTc-YF4VXtsg', 'Senior Inside Sales Manager', 'Singapore', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Love the Sydney CBD expansion. King Street and Pitt Street locations look great!', 'We''re working with some excellent sales executives at the moment who have strong coworking and flexible workspace experience. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.', 'I see you''re building out your sales team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent landscape, particularly around sales executive hires in the coworking space. The demand for experienced sales professionals who understand flexible workspace solutions has really picked up.', '2025-09-25T05:08:34.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec69HmRrMRNvDwJV' 
       OR (LOWER(name) = LOWER('Jonathan Chua') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABsOXUsB-1py8q8LNvzMdsvxTc-YF4VXtsg' )
);
-- Insert: Jordan Akers (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec69wC19ZPRYDVcb', 'Jordan Akers', NULL, 'https://www.linkedin.com/in/ACwAABGMQscBBGeZZ8BYa_-lS4sTEjvzRKafm7k', 'Sales Director, APAC', 'Melbourne, Australia', 'in queue', 'High', 'LinkedIn Job Posts', '2025-09-19T05:28:41.766Z', 'Saw the news about Planful''s record bookings in 2024. That''s exciting growth!', 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases.', 'I see you''re building out your team. How are you finding the SDR market with all the expansion happening? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in SaaS companies scaling globally.', '2025-09-17T14:23:43.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec69wC19ZPRYDVcb' 
       OR (LOWER(name) = LOWER('Jordan Akers') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABGMQscBBGeZZ8BYa_-lS4sTEjvzRKafm7k' )
);
-- Insert: Jonathan Mathers (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec6G7Ge7E71rN2P7', 'Jonathan Mathers', NULL, 'https://www.linkedin.com/in/ACwAAAxyRmcBVUhXPlThfi0RzWXoodZD0OFpME4', 'Sales Director', 'Manly West, Queensland, Australia', 'messaged', 'High', 'LinkedIn Job Posts', '2025-09-19T05:28:32.756Z', 'Saw the new board appointments and restructure. Great to see Xref moving forward strong.', 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.', 'I see you''re building out your team. How are you finding the SDR market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in HR tech and SaaS.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec6G7Ge7E71rN2P7' 
       OR (LOWER(name) = LOWER('Jonathan Mathers') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAxyRmcBVUhXPlThfi0RzWXoodZD0OFpME4' )
);
-- Insert: Daniel Lawrence (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec6RoukZ1l5LM40z', 'Daniel Lawrence', NULL, 'https://www.linkedin.com/in/ACwAAAGaZLUBshsiFpzXx7PoBY_X2j-S_NGpIEA', 'Major Account Executive FSI & Critical Infrastructure', 'Greater Sydney Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the MiClub partnership news. Great work in the local market!', 'We''re working with some excellent enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.', 'I see you''re building out your enterprise sales team. How are you finding the talent market for senior AE hires? We''re noticing some interesting shifts in the market, particularly around enterprise sales talent with cloud infrastructure experience.', '2025-09-28T14:38:02.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec6RoukZ1l5LM40z' 
       OR (LOWER(name) = LOWER('Daniel Lawrence') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAGaZLUBshsiFpzXx7PoBY_X2j-S_NGpIEA' )
);
-- Insert: Polly Parker (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec6dod4hTQTj5MRQ', 'Polly Parker', NULL, 'https://www.linkedin.com/in/ACwAAAdR2UYBf976d6piwzdm_lU8vcJpGsiKuO0', 'Enterprise Sales Manager', 'Melbourne, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the Sydney CBD expansion. Great locations!', 'We''re working with some excellent sales executives at the moment who understand the coworking market well. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.', 'I see you''re building out your sales team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the landscape, particularly around sales executive hires in the coworking space. The competition for quality sales talent has definitely ramped up with all the flexible workspace growth happening locally.', '2025-09-25T04:46:17.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec6dod4hTQTj5MRQ' 
       OR (LOWER(name) = LOWER('Polly Parker') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAdR2UYBf976d6piwzdm_lU8vcJpGsiKuO0' )
);
-- Insert: Eric Rollett (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec6qLkHfUpNxIz68', 'Eric Rollett', NULL, 'https://www.linkedin.com/in/ACwAAAB-eTABP-Rtrl-CBifx9QYSK5veSL_DNNQ', 'Director of Channel Partnerships - Australia', 'North Sydney, New South Wales, Australia', 'in queue', 'High', 'LinkedIn Job Posts', '2025-10-01T23:29:22.289Z', 'Saw the Gartner recognition for ESET. Great achievement!', 'We''re working with some excellent channel sales professionals at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their partner ecosystems.', 'Hope you''re well Eric! I see you''re building out your channel sales team. How are you finding the local talent market in North Sydney? We''re noticing some interesting shifts in the market, particularly around channel sales hires in cybersecurity. With ESET''s recent growth and the new training platform launch, I imagine you''re seeing strong demand for experienced channel professionals.', '2025-10-01T14:19:46.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec6qLkHfUpNxIz68' 
       OR (LOWER(name) = LOWER('Eric Rollett') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAB-eTABP-Rtrl-CBifx9QYSK5veSL_DNNQ' )
);
-- Insert: Andrew Wilkins (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec6whP1uYEtfk6zs', 'Andrew Wilkins', NULL, 'https://www.linkedin.com/in/andrewjwilkins', 'Head of Channel Sales AU & NZ', 'Sydney, Australia', 'new', 'High', '', NULL, 'Saw the new partnerships with CPA.com and GrowCFO. Great moves for the ANZ market!', 'We''re working with some excellent SDR candidates in the finance software space at the moment. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your team. How are you finding the market for SDRs in finance software across ANZ? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in fintech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec6whP1uYEtfk6zs' 
       OR (LOWER(name) = LOWER('Andrew Wilkins') OR linkedin_url = 'https://www.linkedin.com/in/andrewjwilkins' )
);
-- Insert: Tom Jackson (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec70chjeQIIFwh8t', 'Tom Jackson', NULL, 'https://www.linkedin.com/in/ACwAAArTmzIBDeODYiSoDDTlhbal9wFVOVoIy_8', 'Director - Sales & Customer Success', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the new Melbourne office fit-out. Looks amazing!', 'We''re working with some excellent BD candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around Business Development hires in the software space. The Melbourne market has been quite dynamic lately.', '2025-09-23T14:38:18.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec70chjeQIIFwh8t' 
       OR (LOWER(name) = LOWER('Tom Jackson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAArTmzIBDeODYiSoDDTlhbal9wFVOVoIy_8' )
);
-- Insert: Jack Mullard (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec7HEx7QFxCGlMIy', 'Jack Mullard', NULL, 'https://www.linkedin.com/in/ACwAACPgIgIByrpSDkR7GuyUBh5VfIxt3a4JwoE', 'Head of Commercial', 'Moonee Ponds, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Melbourne office growth at Onside. Love seeing the local team expansion in AgriTech!', 'We''re working with some excellent Account Executive candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team in Melbourne. How are you finding the local talent market for senior sales roles? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in AgriTech. The Melbourne market has been quite active lately.', '2025-09-20T02:48:26.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec7HEx7QFxCGlMIy' 
       OR (LOWER(name) = LOWER('Jack Mullard') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACPgIgIByrpSDkR7GuyUBh5VfIxt3a4JwoE' )
);
-- Insert: Cheryl Duggan (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec7a7tgYJk0XgsEt', 'Cheryl Duggan', NULL, 'https://www.linkedin.com/in/cheryl-duggan-bb15145', 'A/NZ Subscription & Annuity (Renewals) Manager', 'Sydney, Australia', 'new', 'Medium', '', NULL, 'Saw the news about IBM''s $6 billion GenAI business growth. That''s impressive momentum.', 'Hope you''re well! We''re working with some strong sales specialists in the automation platform space. Happy to chat if useful.', 'I see you''re hiring a Brand Sales Specialist for the automation platform. How''s the search going? We work with companies like HubSpot on similar sales roles across ANZ.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec7a7tgYJk0XgsEt' 
       OR (LOWER(name) = LOWER('Cheryl Duggan') OR linkedin_url = 'https://www.linkedin.com/in/cheryl-duggan-bb15145' )
);
-- Insert: Christie Taylor (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec7eOwX23WQUdquS', 'Christie Taylor', NULL, 'https://www.linkedin.com/in/ACwAAAdcstcBJEGkDyseKpNbUzRfKZkITBvEzw8', 'State Sales Manager NSW, WA & QLD - National Automotive Lead', 'Greater Sydney Area, Australia', 'in queue', 'High', 'LinkedIn Job Posts', '2025-09-19T05:28:35.031Z', 'Saw the AdFixus partnership news. Great move for the digital advertising capabilities.', 'We''re working with some strong Sales Managers in marketplace businesses at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.', 'I see you''re building out your sales team. How are you finding the marketplace talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Manager hires in classifieds and marketplace businesses.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec7eOwX23WQUdquS' 
       OR (LOWER(name) = LOWER('Christie Taylor') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAdcstcBJEGkDyseKpNbUzRfKZkITBvEzw8' )
);
-- Insert: Jude Don (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec7mfO6oOEQhgoVJ', 'Jude Don', NULL, 'https://www.linkedin.com/in/judedon', 'Channel Partner Manager', 'Sydney, Australia', 'new', 'Medium', '', NULL, 'Saw the Microsoft Teams Unify certification news. Being the first independent vendor is huge. Congrats!', 'We''re working with some excellent CSM candidates with partner channel experience. Companies like HubSpot and Docusign have found our approach helpful when scaling their customer success teams.', 'I see you''re building out your customer success team. How are you finding the CSM talent market? We''re noticing some interesting shifts, particularly around customer success hires in contact centre tech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec7mfO6oOEQhgoVJ' 
       OR (LOWER(name) = LOWER('Jude Don') OR linkedin_url = 'https://www.linkedin.com/in/judedon' )
);
-- Insert: Mohammed Fouladi (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec7ukafotWKuEHjN', 'Mohammed Fouladi', NULL, 'https://www.linkedin.com/in/mfouladi', 'Director - Product Strategy & Enablement', 'St Leonards, Australia', 'new', 'Medium', '', NULL, 'Saw the Agent Pay launch. Love seeing Mastercard''s innovation in AI payments.', 'We''re working with some excellent consulting sales leaders who understand product strategy. Companies like HubSpot and Docusign have found our approach helpful when scaling their product-led sales functions.', 'I see you''re expanding the consulting sales team. How are you finding the market for product-focused sales talent? We''re noticing some interesting shifts in the talent landscape, particularly around Director level hires who can bridge product strategy and sales in fintech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec7ukafotWKuEHjN' 
       OR (LOWER(name) = LOWER('Mohammed Fouladi') OR linkedin_url = 'https://www.linkedin.com/in/mfouladi' )
);
-- Insert: Geoff Davies (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec7vijxIzx48dS2S', 'Geoff Davies', NULL, 'https://www.linkedin.com/in/geoffdavies1', 'VP and Country Manager ANZ', 'Sydney, Australia', 'new', 'High', '', NULL, 'Saw the $500M Series C news. Congrats on the funding!', 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in IT management and cybersecurity.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec7vijxIzx48dS2S' 
       OR (LOWER(name) = LOWER('Geoff Davies') OR linkedin_url = 'https://www.linkedin.com/in/geoffdavies1' )
);
-- Insert: Daniel Wong (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec89IHoaNat7uQLL', 'Daniel Wong', NULL, 'https://www.linkedin.com/in/daniel-wong-20775721', 'Head of Enterprise Sales and Account Management, ASEAN and North Asia', 'Singapore, Singapore', 'messaged', 'Medium', 'LinkedIn Job Posts', NOW(), 'Congrats on closing the AIB Merchant Services acquisition! That''s fantastic news for the European expansion.', 'We''re working with some excellent Sales Director candidates across fintech if you''re looking externally.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in fintech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec89IHoaNat7uQLL' 
       OR (LOWER(name) = LOWER('Daniel Wong') OR linkedin_url = 'https://www.linkedin.com/in/daniel-wong-20775721' )
);
-- Insert: Izzy Hettiarachchi (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec8Dw396b3CqLbKk', 'Izzy Hettiarachchi', NULL, 'https://www.linkedin.com/in/ACwAAANZUSQBYc-KPrH339AbJ2TCO0JbYnwOKKo', 'Senior Manager, Account Management - Asia, Africa, and Australasia', 'Melbourne, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love seeing Cvent''s growth in Melbourne''s events scene!', 'We''re working with some excellent Account Manager candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.', 'I see you''re building out your account management team. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around Account Manager hires in the events tech space. The Melbourne market has been quite active lately.', '2025-09-23T14:18:53.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec8Dw396b3CqLbKk' 
       OR (LOWER(name) = LOWER('Izzy Hettiarachchi') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAANZUSQBYc-KPrH339AbJ2TCO0JbYnwOKKo' )
);
-- Insert: Leo Zhang (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec8EIClgmmkcKDTM', 'Leo Zhang', NULL, 'https://www.linkedin.com/in/ACwAAAT6qq8BbjTrWvzDIbrK3ZVjGjaRvtL_Cfk', 'Principal Sales Operations Manager', 'Sydney, New South Wales, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Sydney hiring surge at Intercom. 17 roles in 60 days is impressive!', 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases like yours.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in Sydney. The competition for quality AE talent has definitely heated up with all the expansion happening across SaaS companies in the area.', '2025-09-20T06:31:33.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec8EIClgmmkcKDTM' 
       OR (LOWER(name) = LOWER('Leo Zhang') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAT6qq8BbjTrWvzDIbrK3ZVjGjaRvtL_Cfk' )
);
-- Insert: Michael Hull (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec8FKT64UecPW2t4', 'Michael Hull', NULL, 'https://www.linkedin.com/in/ACwAAAB9bQ4BG34nJ2m_iV8ndahqhZobl3N0fd8', 'Regional Director', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Victorian public sector wins. Great local impact!', 'We''re working with some excellent business development candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.', 'Hope you''re well Michael! I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the market, particularly around business development hires in Melbourne. With all the Victorian public sector momentum you''ve got going, I imagine you''re looking at some exciting growth opportunities. Would love to chat about what we''re seeing in the market.', '2025-09-23T14:38:18.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec8FKT64UecPW2t4' 
       OR (LOWER(name) = LOWER('Michael Hull') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAB9bQ4BG34nJ2m_iV8ndahqhZobl3N0fd8' )
);
-- Insert: Adam Brew (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec8QSRxfJteUQ4Bz', 'Adam Brew', NULL, 'https://www.linkedin.com/in/ACwAAAhAqd0Bjs5Lwxsp7wy9DT87z-7eXIZ8vqo', 'General Manager', 'Perth, Western Australia, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Weir acquisition news. That''s huge for Perth!', 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during major transitions and scaling phases.', 'Hope you''re well Adam! I see you''re building out your sales team. How are you finding the Perth talent market with all the changes happening? We''re noticing some interesting shifts in the market, particularly around enterprise sales hires in mining tech. Would love to share what we''re seeing if helpful.', '2025-09-28T04:05:27.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec8QSRxfJteUQ4Bz' 
       OR (LOWER(name) = LOWER('Adam Brew') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAhAqd0Bjs5Lwxsp7wy9DT87z-7eXIZ8vqo' )
);
-- Insert: Sruthi K. (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec8Vi5fK6o1xrjqJ', 'Sruthi K.', NULL, 'https://www.linkedin.com/in/ACwAAAhct7UBcE7tc2KOCHERSIAjhOJeNf-Br4E', 'Senior Director - Field & Member Services', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the APAC hub approach from Sydney. Smart regional strategy!', 'We''re working with some excellent senior account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out their regional teams.', 'I see you''re building out your account management team. How are you finding the talent market across the region? We''re noticing some interesting shifts around senior account manager hires in the IT services space, particularly with companies scaling their APAC operations.', '2025-09-25T03:27:03.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec8Vi5fK6o1xrjqJ' 
       OR (LOWER(name) = LOWER('Sruthi K.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAhct7UBcE7tc2KOCHERSIAjhOJeNf-Br4E' )
);
-- Insert: Pavel Kamychnikov (LEAD LOST)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec8XrWa34AfLsT3f', 'Pavel Kamychnikov', NULL, 'https://www.linkedin.com/in/ACwAAAdebqMBamtw7bVKv4XhaFK1825UvkrcWg0', 'Head of Sales - APAC', 'Greater Sydney Area, Australia', 'lead_lost', 'High', 'LinkedIn Job Posts', '2025-09-21T23:33:59.103Z', 'Saw the Q2 earnings results. Love seeing Sprout Social beating analyst expectations!', 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out enterprise sales in Australia. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise AE hires in SaaS.', '2025-09-17T14:32:06.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec8XrWa34AfLsT3f' 
       OR (LOWER(name) = LOWER('Pavel Kamychnikov') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAdebqMBamtw7bVKv4XhaFK1825UvkrcWg0' )
);
-- Insert: Naina Vishnoi (CONNECTED)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec8nM8D0Nyse0nWq', 'Naina Vishnoi', NULL, 'https://www.linkedin.com/in/ACwAAAVivAoBbrNnODb27V6QMaM4i55BiYGy7jY', 'Senior Sales Director - APAC & IMEA, Suppliers & venue solutions', 'Singapore, Singapore', 'connected', 'High', 'LinkedIn Job Posts', '2025-09-25T02:32:11.984Z', 'Saw Cvent at AIME Melbourne. Love the local presence!', 'We''re working with some excellent Account Manager candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Manager hires in the events tech space. With all the optimism around in-person meetings growth heading into 2025, there seems to be real momentum in Melbourne right now.', '2025-09-23T14:18:54.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec8nM8D0Nyse0nWq' 
       OR (LOWER(name) = LOWER('Naina Vishnoi') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAVivAoBbrNnODb27V6QMaM4i55BiYGy7jY' )
);
-- Insert: James Hanna (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec9fL9vJCtOI3Lu4', 'James Hanna', NULL, 'https://www.linkedin.com/in/ACwAAAAdJxgBfLuWUw2RDn2WmSgyS-DoB9F5kw0', 'National Sales Manager', 'Sydney, Australia', 'new', 'High', '', NULL, 'Saw the Cisco Partner Summit award news. Congrats on the Crisis Response Award!', 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in tech and IoT space.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec9fL9vJCtOI3Lu4' 
       OR (LOWER(name) = LOWER('James Hanna') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAdJxgBfLuWUw2RDn2WmSgyS-DoB9F5kw0' )
);
-- Insert: Margaret Selianakis (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec9mIBN2s6QiKiZZ', 'Margaret Selianakis', NULL, 'https://www.linkedin.com/in/ACwAAAAnwFMBLTKYN4izcEKNVTJlklxIWqRaZz8', 'Sales Manager', 'Brunswick, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the MiClub golf club success story. Great local impact!', 'We''re working with some excellent enterprise AEs at the moment who have strong cloud security backgrounds. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.', 'I see you''re building out your enterprise sales team. How are you finding the talent market for senior AEs in the cloud security space? We''re noticing some interesting shifts in the market, particularly around enterprise sales hires who can navigate complex cybersecurity solutions.', '2025-09-28T14:38:01.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec9mIBN2s6QiKiZZ' 
       OR (LOWER(name) = LOWER('Margaret Selianakis') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAnwFMBLTKYN4izcEKNVTJlklxIWqRaZz8' )
);
-- Insert: David Wright (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec9q2wlHikQ8gG0L', 'David Wright', NULL, 'https://www.linkedin.com/in/ACwAAASgczwB3c_Jy9Yy1mSBWoRzqSRtnNehDGI', 'Regional Vice President (RVP) A/NZ', 'Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love what Cornerstone''s doing in the HR tech space!', 'We''re working with some excellent BDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around BDR hires in SaaS. The demand for quality candidates who can navigate complex enterprise sales cycles has really picked up. Would love to chat about what we''re seeing if you''re open to it.', '2025-09-20T06:24:19.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec9q2wlHikQ8gG0L' 
       OR (LOWER(name) = LOWER('David Wright') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAASgczwB3c_Jy9Yy1mSBWoRzqSRtnNehDGI' )
);
-- Insert: Isobel Shurley (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec9tENYimdhE2txc', 'Isobel Shurley', NULL, 'https://www.linkedin.com/in/ACwAAAkW-q4BRyYG2FKlqmS04ASROo4reH6Jd6A', 'Director ANZ Sales Operations, Global Sales Operations', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the new Sydney office opening at Australia Square. That''s exciting!', 'We''re working with some excellent Account Manager candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases like yours.', 'I see you''re building out your team. How are you finding the local talent market since the office launch? We''re noticing some interesting shifts in the talent landscape, particularly around Account Manager hires in Sydney with all the expansion happening.', '2025-09-23T14:23:20.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec9tENYimdhE2txc' 
       OR (LOWER(name) = LOWER('Isobel Shurley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAkW-q4BRyYG2FKlqmS04ASROo4reH6Jd6A' )
);
-- Insert: Kiran Ajbani (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rec9y8lp1H1fDmSms', 'Kiran Ajbani', NULL, 'https://www.linkedin.com/in/kiranajbani', 'Sr Regional Sales Director', 'Melbourne, Australia', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), 'Saw the Gartner Leader recognition for HCLSoftware. Congrats on that achievement!', 'We''re working with some strong Sales Director candidates in enterprise software. Happy to chat if useful.', 'I see you''re hiring a Sales Director at HCLSoftware. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rec9y8lp1H1fDmSms' 
       OR (LOWER(name) = LOWER('Kiran Ajbani') OR linkedin_url = 'https://www.linkedin.com/in/kiranajbani' )
);
-- Insert: Randeep Chhabra (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recA5zyxdE11Asofv', 'Randeep Chhabra', NULL, 'https://www.linkedin.com/in/randeep-chhabra-3581b26', 'Sales Leader - Asia Pacific and Japan (Application Security)', 'Melbourne, Australia', 'new', 'Medium', '', NULL, 'Saw the Gartner Leader recognition for HCL Software. Great achievement for the team!', 'Hope you''re well! We''re working with some strong Sales Director candidates in enterprise software. Happy to chat if useful.', 'I see you''re hiring a Sales Director at HCL Software. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recA5zyxdE11Asofv' 
       OR (LOWER(name) = LOWER('Randeep Chhabra') OR linkedin_url = 'https://www.linkedin.com/in/randeep-chhabra-3581b26' )
);
-- Insert: Avi Ben-Galil (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recALzvi9TUNcDtAA', 'Avi Ben-Galil', NULL, 'https://www.linkedin.com/in/ACwAAA8ffksBtqrpyvh-1x5tG3A2kryAdKNfhxc', 'Director of Business Development& Partnerships, EMEA & APAC', 'Singapore', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Ascend Australia summit in Melbourne. Great local engagement!', 'We''re working with some excellent AE candidates in the fraud prevention space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.', 'I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the landscape, particularly around AE hires in fraud prevention. The local fintech scene seems to be heating up with all the ecommerce growth.', '2025-09-28T14:32:58.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recALzvi9TUNcDtAA' 
       OR (LOWER(name) = LOWER('Avi Ben-Galil') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA8ffksBtqrpyvh-1x5tG3A2kryAdKNfhxc' )
);
-- Insert: Jaye Vernon (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recAVEfKluCdO3422', 'Jaye Vernon', NULL, 'https://www.linkedin.com/in/ACwAABlQoaMBrAFqQD7MksNFiJ-i4u4clOxYse0', 'Area Vice President, ANZ', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the new Sydney data centre launch. Exciting expansion!', 'We''re working with some excellent enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases like yours.', 'I see you''re building out your enterprise sales team. How are you finding the local talent market with all the expansion happening? We''re noticing some interesting shifts in the talent landscape, particularly around senior AE hires in Sydney.', '2025-09-20T06:22:46.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recAVEfKluCdO3422' 
       OR (LOWER(name) = LOWER('Jaye Vernon') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABlQoaMBrAFqQD7MksNFiJ-i4u4clOxYse0' )
);
-- Insert: Adrian Valois (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recAWrugQA8E0WNB5', 'Adrian Valois', NULL, 'https://www.linkedin.com/in/ACwAABAXBnUBaOY1Vl_Lm1GYO2HAEE2RuRfT_P8', 'Senior Manager, Enterprise Sales ', 'Greater Sydney Area', 'messaged', 'High', 'LinkedIn Job Posts', '2025-09-25T02:33:56.117Z', 'Saw the inaugural Protect Tour in Sydney. Great turnout!', 'We''re working with some excellent BDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your BDR team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around BDR hires in cybersecurity here in Sydney.', '2025-09-23T14:35:44.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recAWrugQA8E0WNB5' 
       OR (LOWER(name) = LOWER('Adrian Valois') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABAXBnUBaOY1Vl_Lm1GYO2HAEE2RuRfT_P8' )
);
-- Insert: Aaron Thorne (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recArXdx1MRnheDud', 'Aaron Thorne', NULL, 'https://www.linkedin.com/in/ACwAABGzwZUBA5LAplhseW7ZywUqYZgNT7uwujA', 'Chief Sales Officer', 'Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the intelliHR rebrand to Humanforce HR. Smart consolidation move!', 'We''re working with some excellent Solutions Consultants and presales professionals at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their customer facing teams.', 'I see you''re in the Solutions Consultant space at Humanforce. How are you finding the market with all the cloud migration activity happening? We''re noticing some interesting shifts in the talent market, particularly around presales and solutions roles in the HCM space. The North Sydney hub seems to be really growing from what we''re seeing.', '2025-10-01T14:18:15.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recArXdx1MRnheDud' 
       OR (LOWER(name) = LOWER('Aaron Thorne') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABGzwZUBA5LAplhseW7ZywUqYZgNT7uwujA' )
);
-- Insert: Eric Seah (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recB1ZLio9tCZRIer', 'Eric Seah', NULL, 'https://www.linkedin.com/in/ACwAAAEw5YMBlGqi0hOaj20kgnfkKxxTlM52zak', 'Channel Director Asean', 'Singapore', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Melbourne office expansion. Love the local growth!', 'We''re working with some excellent mid-market AEs at the moment who understand the privacy compliance space really well. Companies like HubSpot and Docusign have found our approach helpful during their local expansion phases.', 'Hope you''re settling in well with the Melbourne expansion! How are you finding the local talent market? We''re seeing some interesting shifts around mid-market AE hiring in the privacy space, particularly with all the regulatory changes happening locally.', '2025-09-22T14:27:20.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recB1ZLio9tCZRIer' 
       OR (LOWER(name) = LOWER('Eric Seah') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEw5YMBlGqi0hOaj20kgnfkKxxTlM52zak' )
);
-- Insert: Georgia Hinks (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recBe4y2QYxu0jkqU', 'Georgia Hinks', NULL, 'https://www.linkedin.com/in/georgia-hinks-7443b034a', 'Sales Manager', 'Gaythorne, Australia', 'connection_requested', 'Medium', 'LinkedIn Job Posts', NOW(), 'Saw the Sirius Solutions acquisition news. Great move to expand your transformation capabilities!', 'We''re working with some strong CSM candidates at the moment. Happy to chat if useful.', 'I see you''re hiring a CSM at eTeam. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recBe4y2QYxu0jkqU' 
       OR (LOWER(name) = LOWER('Georgia Hinks') OR linkedin_url = 'https://www.linkedin.com/in/georgia-hinks-7443b034a' )
);
-- Insert: Rosie Courtier (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recBkUkl1dvVaO0AL', 'Rosie Courtier', NULL, 'https://www.linkedin.com/in/ACwAAB6P9ikBoPVoGdTWSGB5xcwF8ekUnHiMus4', 'Sales Manager, Business Development', 'Sydney, New South Wales, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Better by SafetyCulture event in Sydney. That looked fantastic!', 'We''re working with some excellent enterprise AE candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.', 'I see you''re building out your enterprise team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent landscape, particularly around senior AE hires in the SaaS space. With SafetyCulture being voted one of Australia''s top workplaces, you must be attracting some great candidates.', '2025-09-28T14:42:06.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recBkUkl1dvVaO0AL' 
       OR (LOWER(name) = LOWER('Rosie Courtier') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAB6P9ikBoPVoGdTWSGB5xcwF8ekUnHiMus4' )
);
-- Insert: Angus MacRae (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recBpKzlIqEuc39EH', 'Angus MacRae', NULL, 'https://www.linkedin.com/in/ACwAABjmy_0B8deeVR5o8IayMxX1GsSLutw0QM4', 'Senior Sales Operations Manager', 'Sydney, New South Wales, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Deputy Payroll launch. That''s a huge win for shift-based businesses!', 'We''re seeing some strong Account Manager talent in the market lately. Companies like HubSpot and Docusign have found our approach helpful during product expansion phases.', 'I see Deputy just launched the new payroll solution. How are you finding the local market response? We''re noticing some interesting shifts in the talent landscape, particularly around Account Manager hires in workforce management.', '2025-09-20T14:15:40.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recBpKzlIqEuc39EH' 
       OR (LOWER(name) = LOWER('Angus MacRae') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABjmy_0B8deeVR5o8IayMxX1GsSLutw0QM4' )
);
-- Insert: Farooq Fasih Ghauri (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recBqR8dj4h6Aaff9', 'Farooq Fasih Ghauri', NULL, 'https://www.linkedin.com/in/ACwAAAXn808BJihsG8YgOUwvVWxpPBY3RS5yP8U', 'Managing Director AU / NZ- Regional Director APAC', 'Sydney, Australia', 'new', 'High', '', NULL, 'Saw the news about the multi-million dollar contract win in Australia. Congrats on landing that!', 'We''re working with some experienced Regional Sales Directors in automotive finance at the moment. Companies like HubSpot and Docusign have found our approach helpful for senior sales hires.', 'I see you''re building out your sales team. How are you finding the market for senior sales talent in automotive finance? We''re noticing some interesting shifts in the talent landscape, particularly around Regional Sales Director hires in fintech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recBqR8dj4h6Aaff9' 
       OR (LOWER(name) = LOWER('Farooq Fasih Ghauri') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAXn808BJihsG8YgOUwvVWxpPBY3RS5yP8U' )
);
-- Insert: Dan Hartman (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recC3jcIBsyEwOW2s', 'Dan Hartman', NULL, 'https://www.linkedin.com/in/ACwAABAkdiABz4AQpCa8WN-GpRLmkiBPdFnyDYI', 'Sales Director, Commercial', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the new Sydney data centre launch. Exciting times at Braze!', 'We''re working with some excellent enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their local expansion phases.', 'I see you''re part of the big Sydney expansion. How are you finding the local talent market with all the growth happening? We''re noticing some interesting shifts in the market, particularly around enterprise AE hires as companies scale their ANZ operations.', '2025-09-20T06:22:46.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recC3jcIBsyEwOW2s' 
       OR (LOWER(name) = LOWER('Dan Hartman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABAkdiABz4AQpCa8WN-GpRLmkiBPdFnyDYI' )
);
-- Insert: Kim Gardiner (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recC61FhHRn6WCuHt', 'Kim Gardiner', NULL, 'https://www.linkedin.com/in/ACwAAAv-VjcBeFpwkNt8Joe8QCb2W-DiWV0yCgA', 'Director Corporate Sales APAC', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Australian data residency launch. That''s exciting!', 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling into new market opportunities.', 'I see you''re building out your enterprise team. How are you finding the market with all the new opportunities from the data residency launch? We''re noticing some interesting shifts in the talent market, particularly around enterprise sales hires in the regulated sectors.', '2025-09-28T14:40:08.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recC61FhHRn6WCuHt' 
       OR (LOWER(name) = LOWER('Kim Gardiner') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAv-VjcBeFpwkNt8Joe8QCb2W-DiWV0yCgA' )
);
-- Insert: Reece Watson (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recCBb75CHviEe1J8', 'Reece Watson', NULL, 'https://www.linkedin.com/in/ACwAAAfRa-8BKkZ1A6rDggqIIjQfuTFV_Uq8s6s', 'Vice President, Sales & Customer Success', 'Greater Melbourne Area', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-25T02:34:35.515Z', 'Saw the new Melbourne office fit out. Love the local investment!', 'We''re working with some excellent BD candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams locally.', 'I see you''re building out your BD team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around business development hires in the govtech space. The Victorian public sector expansion you''re seeing must be creating some exciting opportunities.', '2025-09-23T14:38:17.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recCBb75CHviEe1J8' 
       OR (LOWER(name) = LOWER('Reece Watson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAfRa-8BKkZ1A6rDggqIIjQfuTFV_Uq8s6s' )
);
-- Insert: Gareth Parker (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recCD7F1y38E15hXB', 'Gareth Parker', NULL, 'https://www.linkedin.com/in/ACwAAAFNYkwBhoK2hXsy39aXjdmy-7_w2IApl1k', 'VP Sales, Asia Pacific', 'Australia', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-19T05:28:43.834Z', 'Saw the Gartner Magic Quadrant recognition. Congrats on the Visionary status!', 'We''re working with some excellent AE candidates in the communications space at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the communications tech market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in API and communications platforms.', '2025-09-17T14:30:05.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recCD7F1y38E15hXB' 
       OR (LOWER(name) = LOWER('Gareth Parker') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFNYkwBhoK2hXsy39aXjdmy-7_w2IApl1k' )
);
-- Insert: Yue Wang (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recCIA74gbbx8wL12', 'Yue Wang', NULL, 'https://www.linkedin.com/in/yue-wang-721317280', 'VP of Sales APAC', 'Singapore, Singapore', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), 'Saw the $60M funding and SF move. Congrats on the milestone!', 'We''re working with some strong Enterprise AE candidates in the ANZ market. Happy to chat if useful.', 'I see you''re hiring Enterprise AEs in ANZ at Zilliz. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recCIA74gbbx8wL12' 
       OR (LOWER(name) = LOWER('Yue Wang') OR linkedin_url = 'https://www.linkedin.com/in/yue-wang-721317280' )
);
-- Insert: Polly Parker (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recCWv1EAS9cBvdq4', 'Polly Parker', NULL, 'https://www.linkedin.com/in/ACwAAAdR2UYBf976d6piwzdm_lU8vcJpGsiKuO0', 'Enterprise Sales Manager', 'Melbourne, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love what you''re building across Sydney''s CBD!', 'We''re working with some excellent sales candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in competitive markets.', 'I see you''re hiring for a Sales Executive role. How are you finding the local talent market? We''re noticing some interesting shifts around sales hiring in Sydney, particularly with the coworking space growth. Always keen to chat with sales leaders about what they''re seeing on the ground.', '2025-09-25T05:08:33.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recCWv1EAS9cBvdq4' 
       OR (LOWER(name) = LOWER('Polly Parker') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAdR2UYBf976d6piwzdm_lU8vcJpGsiKuO0' )
);
-- Insert: Oliver Godwin (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recCeTunTD5V3zj0l', 'Oliver Godwin', NULL, 'https://www.linkedin.com/in/oliver-godwin-603833178', 'Manager, Commercial Sales ANZ', 'Sydney, Australia', 'new', 'Medium', '', NULL, 'Saw the Bits AI updates at DASH 2025. Love seeing the autonomous code fixes feature.', 'We''re working with some excellent Sales Engineers with AI and observability backgrounds. Companies like HubSpot and Docusign have found our approach helpful for technical roles.', 'I see you''re building out your Sales Engineering team. How are you finding the market for technical talent in ANZ? We''re noticing some interesting shifts, particularly around Sales Engineering hires in observability platforms.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recCeTunTD5V3zj0l' 
       OR (LOWER(name) = LOWER('Oliver Godwin') OR linkedin_url = 'https://www.linkedin.com/in/oliver-godwin-603833178' )
);
-- Insert: Keith Chen (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recCgo0RcsrPYcplH', 'Keith Chen', NULL, 'https://www.linkedin.com/in/ACwAAAeJN90BfvO6ltDf-p_IYsCKyk-KOuB25qU', 'Head of Business, Singapore', 'Singapore, Singapore', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the Australia expansion strategy. Great timing!', 'We''re working with some excellent BDR candidates in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful when expanding into new markets.', 'I see you''re building out the team for the Australia launch. How are you finding the talent market here? We''re noticing some interesting shifts in the fintech space, particularly around BDR hires who understand the payments landscape. The merchant acquiring space is getting competitive, but there''s some strong talent around.', '2025-09-28T04:13:43.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recCgo0RcsrPYcplH' 
       OR (LOWER(name) = LOWER('Keith Chen') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAeJN90BfvO6ltDf-p_IYsCKyk-KOuB25qU' )
);
-- Insert: Justin Barlow (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recChRe2stvwzpEhw', 'Justin Barlow', NULL, 'https://www.linkedin.com/in/ACwAAATvy-AB0svvj7XMtSSMWyfogHSNf-xBbek', 'Territory Sales Manager - ANZ', 'Greater Brisbane Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Simpro Marketplace launch from Brisbane. That''s exciting!', 'We''re working with some excellent Enterprise Account Manager candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise Account Manager hires in field service software. The growth you''re seeing with the Marketplace launch must be creating some great opportunities.', '2025-09-29T14:20:11.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recChRe2stvwzpEhw' 
       OR (LOWER(name) = LOWER('Justin Barlow') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATvy-AB0svvj7XMtSSMWyfogHSNf-xBbek' )
);
-- Insert: Serene Foo (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recCviIMZke1LDLEL', 'Serene Foo', NULL, 'https://www.linkedin.com/in/ACwAAB5RaFoBV8KjFjdzBBYcS36HQhtfaQVkAus', 'Assistant Director, Public Relations (Asia Pacific)', 'Singapore, Singapore', 'new', 'Low', 'LinkedIn Job Posts', NULL, 'Saw the news about hitting $100M ARR. Congrats on the milestone!', 'We''re working with some strong AE candidates with IP and tech backgrounds at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.', 'I see you''re building out your sales team. How are you finding the market for AE talent? We''re noticing some interesting shifts in the IP and tech space, particularly around experienced AE hires who understand complex B2B sales cycles.', '2025-09-17T14:21:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recCviIMZke1LDLEL' 
       OR (LOWER(name) = LOWER('Serene Foo') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAB5RaFoBV8KjFjdzBBYcS36HQhtfaQVkAus' )
);
-- Insert: Steven Clement (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recD8qWuOHscqZdjA', 'Steven Clement', NULL, 'https://www.linkedin.com/in/ACwAAAEb4DUBeUwi6SQDUVdEgo6OeU2nxm9Z0n8', 'VP of Sales', 'North Narrabeen, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Deputy Payroll launch in Australia. That''s exciting!', 'We''re working with some excellent Account Manager candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent market, particularly around Account Manager hires in workforce management. The payroll launch must be driving some serious growth opportunities for you guys.', '2025-09-20T14:15:39.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recD8qWuOHscqZdjA' 
       OR (LOWER(name) = LOWER('Steven Clement') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEb4DUBeUwi6SQDUVdEgo6OeU2nxm9Z0n8' )
);
-- Insert: Lorena Casillas (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recDKzLrskXw13hwA', 'Lorena Casillas', NULL, 'https://www.linkedin.com/in/ACwAAArZtHcBuwryEeDIF-jhYJxtymiKqkKFhgg', 'Growth Marketing Lead', 'Sydney, Australia', 'new', 'Low', '', NULL, 'Saw the Sydney expansion news. That''s exciting!', 'We''re working with some excellent CSM candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.', 'I see you''re building out your team in Sydney. How are you finding the CSM market there? We''re noticing some interesting shifts in the talent landscape, particularly around Customer Success hires with the number of companies expanding into Australia.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recDKzLrskXw13hwA' 
       OR (LOWER(name) = LOWER('Lorena Casillas') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAArZtHcBuwryEeDIF-jhYJxtymiKqkKFhgg' )
);
-- Insert: Suhail Ismail (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recDOVaQh3eqKb42L', 'Suhail Ismail', NULL, 'https://www.linkedin.com/in/ACwAAA8POsUBAIK11SjhnMOOuawfoGcHyfmyezU', 'Sales Director', 'Greater Sydney Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Sydney partner bootcamps in May. Great initiative!', 'We''re working with some excellent AE candidates in the Sydney market at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.', 'I see you''re building out your team at Saviynt. How are you finding the local talent market? We''re noticing some interesting shifts in the talent space, particularly around Account Executive hires in Sydney. With all the expansion happening at Three International Towers, I imagine you''re seeing increased demand for quality sales talent.', '2025-09-23T14:16:10.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recDOVaQh3eqKb42L' 
       OR (LOWER(name) = LOWER('Suhail Ismail') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA8POsUBAIK11SjhnMOOuawfoGcHyfmyezU' )
);
-- Insert: Steven Newman (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recDQoJ16cq1xDNe3', 'Steven Newman', NULL, 'https://www.linkedin.com/in/ACwAAANOCu4BS8cuqi05PQq5R9ZYNqoeR_tzY6w', 'Commercial Manager', 'Brisbane, Queensland, Australia', 'messaged', 'Medium', 'LinkedIn Job Posts', '2025-09-29T01:06:18.602Z', 'Saw the rebrand to Klipboard. Exciting evolution from KCS!', 'We''re working with some excellent New Business Sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your sales team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around New Business Sales Executive hires in the SaaS space. The field service management sector has been heating up lately.', '2025-09-28T04:03:25.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recDQoJ16cq1xDNe3' 
       OR (LOWER(name) = LOWER('Steven Newman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAANOCu4BS8cuqi05PQq5R9ZYNqoeR_tzY6w' )
);
-- Insert: Mark Henderson (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recDRuSgo75dHVAy5', 'Mark Henderson', NULL, 'https://www.linkedin.com/in/ACwAAAWqQYAB5z24_8cQjHckIE9DDjkt5ldZan8', 'Sales Director @ShiftCare', 'Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the new platform updates for aged care compliance. Great timing with the 2025 reforms coming.', 'We''re working with some strong BDR candidates in healthcare tech at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the healthcare tech market? We''re noticing some interesting shifts in the talent landscape, particularly around BDR hires in aged care and health services.', '2025-09-18T20:57:17.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recDRuSgo75dHVAy5' 
       OR (LOWER(name) = LOWER('Mark Henderson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAWqQYAB5z24_8cQjHckIE9DDjkt5ldZan8' )
);
-- Insert: Andrew Maresca (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recDjf3njedZothfQ', 'Andrew Maresca', NULL, 'https://www.linkedin.com/in/ACwAAAGm_ngBlrNLRD8VjSJg2E0g4YGtaqjmggM', 'Sales Leader - Asia Pacific & Japan', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the X4 Sydney Summit news and the new AI tech launch. That''s exciting stuff!', 'We''re working with some great Partner Sales Managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their channel teams.', 'I see you''re building out the partner team. How are you finding the channel sales market in Australia? We''re noticing some interesting shifts in the talent landscape, particularly around Partner Sales Manager hires in SaaS.', '2025-09-18T21:00:48.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recDjf3njedZothfQ' 
       OR (LOWER(name) = LOWER('Andrew Maresca') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAGm_ngBlrNLRD8VjSJg2E0g4YGtaqjmggM' )
);
-- Insert: Sam Salehi (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recDnNqETYEy30FdY', 'Sam Salehi', NULL, 'https://www.linkedin.com/in/ACwAAADw8q0BPsC8bsHeAWjHfZdpavb__4oqcrc', 'Managing Director ANZ', 'Melbourne, Australia', 'new', 'High', '', NULL, 'Saw the mROC Alliance Partners launch. Great move expanding the channel program!', 'We''re working with some experienced Channel Account Managers in cybersecurity. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your team. How are you finding the cybersecurity talent market? We''re noticing some interesting shifts in the landscape, particularly around Channel Account Manager hires in enterprise security.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recDnNqETYEy30FdY' 
       OR (LOWER(name) = LOWER('Sam Salehi') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADw8q0BPsC8bsHeAWjHfZdpavb__4oqcrc' )
);
-- Insert: Luke Corkin (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recDwNVna2H5DYHZo', 'Luke Corkin', NULL, 'https://www.linkedin.com/in/ACwAAASHenMBnjTJ7sZ5hQFwcICyOduXaznsUJA', 'Director of Sales, Enterprise & Strategic', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Better by SafetyCulture event in Sydney. Great showcase!', 'We''re working with some excellent enterprise AE candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.', 'Hope you''re well Luke! I see you''re building out your enterprise team. How are you finding the Sydney talent market? We''re noticing some interesting shifts around senior AE hires locally, especially with the competition for enterprise experience heating up.', '2025-09-28T14:42:05.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recDwNVna2H5DYHZo' 
       OR (LOWER(name) = LOWER('Luke Corkin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAASHenMBnjTJ7sZ5hQFwcICyOduXaznsUJA' )
);
-- Insert: Michael van Zoggel (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recEAeRQdwSI5MjfU', 'Michael van Zoggel', NULL, 'https://www.linkedin.com/in/ACwAAAQnMoEBHcV6X9lOylMcccIYqzK79CQ1vIs', 'General Manager - WA', 'Perth, Australia', 'new', 'High', '', NULL, 'Saw the Cisco Partner Summit award news. Congrats on the Crisis Response Award!', 'We''re working with some excellent AE candidates with tech backgrounds at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the AE market in Melbourne? We''re noticing some interesting shifts in the talent landscape, particularly around tech sales hires with IoT experience.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recEAeRQdwSI5MjfU' 
       OR (LOWER(name) = LOWER('Michael van Zoggel') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAQnMoEBHcV6X9lOylMcccIYqzK79CQ1vIs' )
);
-- Insert: Tom Tokic (REPLIED)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recED41KqdkZSijCZ', 'Tom Tokic', NULL, 'https://www.linkedin.com/in/ACwAAABznFYBZk-gXM3qpGrIN-NKxhDHFngk5co', 'Regional Vice President of Sales - APJ', 'Canberra, Australian Capital Territory, Australia', 'replied', 'High', 'LinkedIn Job Posts', '2025-09-21T23:24:47.429Z', 'Congrats on the Regional Executive APJ role. Exciting times!', 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during regional expansion phases.', 'I see you''re building out the team across APAC. How are you finding the talent market as you scale regionally? We''re noticing some interesting shifts in the market, particularly around Enterprise AE hires in cybersecurity.', '2025-09-20T06:12:55.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recED41KqdkZSijCZ' 
       OR (LOWER(name) = LOWER('Tom Tokic') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABznFYBZk-gXM3qpGrIN-NKxhDHFngk5co' )
);
-- Insert: Arnold Chan (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recEMzFWrI1jx4zoB', 'Arnold Chan', NULL, 'https://www.linkedin.com/in/ACwAAARePtUBmXogWwJ6w5A7SG378L6NTyuXunE', 'General Manager, Australia & New Zealand', 'Melbourne, Australia', 'messaged', 'High', 'LinkedIn Job Posts', NOW(), 'Saw the OpenPay acquisition news. Smart move expanding into billing!', 'We''re working with some excellent SDR candidates in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases.', 'I see you''re building out your SDR team. How are you finding the fintech talent market with all the expansion happening? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in high-growth fintech companies.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recEMzFWrI1jx4zoB' 
       OR (LOWER(name) = LOWER('Arnold Chan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAARePtUBmXogWwJ6w5A7SG378L6NTyuXunE' )
);
-- Insert: Steve Bailey (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recETIRbIREFhHMm5', 'Steve Bailey', NULL, 'https://www.linkedin.com/in/stevenmichaelbailey', 'Embedded IoT Sales and Key Account Executive', 'Melbourne, Australia', 'new', 'Medium', '', NULL, 'Saw the partnership news with Nagarro. That''s exciting for the WISE-Edge platform!', 'Hope you''re well! We''re working with some strong Key Account Manager candidates in the IoT space. Happy to chat if useful.', 'I see you''re hiring a Key Account Manager at Advantech. How''s the search going? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recETIRbIREFhHMm5' 
       OR (LOWER(name) = LOWER('Steve Bailey') OR linkedin_url = 'https://www.linkedin.com/in/stevenmichaelbailey' )
);
-- Insert: Kane McMonigle (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recEd6tILCyiLh43z', 'Kane McMonigle', NULL, 'https://www.linkedin.com/in/ACwAAAgrtBMBUprFiMISkY6p8LzUnQIOvbJXeL4', 'Sales Manager', 'Sydney, New South Wales, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Love the school partnerships work with ZAAP. Smart move in NSW!', 'We''re working with some excellent partnerships candidates at the moment who have that rare combo of enterprise sales experience and payments industry knowledge. Companies like HubSpot and Docusign have found our approach helpful when building out their partnerships teams.', 'I see you''re building out your partnerships team. How are you finding the talent market for enterprise sales roles in payments? We''re noticing some interesting shifts in the landscape, particularly around partnerships hires in fintech where candidates are looking for that blend of relationship building and technical product knowledge.', '2025-09-23T14:20:14.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recEd6tILCyiLh43z' 
       OR (LOWER(name) = LOWER('Kane McMonigle') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAgrtBMBUprFiMISkY6p8LzUnQIOvbJXeL4' )
);
-- Insert: Peter Coulson (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recEfBn7fJ5Cgczle', 'Peter Coulson', NULL, 'https://www.linkedin.com/in/ACwAAAuwb78B8XQx_C0DX5QZmF4eqynyaDms8oU', 'Vice President  of Sales - Asia Pacific & Japan', 'Singapore, Singapore', 'in queue', 'High', 'LinkedIn Job Posts', '2025-09-29T01:06:06.758Z', 'Saw the Australian cloud launch. That''s exciting for the local market!', 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams in competitive markets.', 'I see you''re building out your team in Sydney. How are you finding the local talent market? We''re noticing some interesting shifts around Enterprise AE hires, especially with companies expanding their local presence like Talkdesk. The regulated industries focus seems to be driving some unique hiring patterns.', '2025-09-28T03:55:17.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recEfBn7fJ5Cgczle' 
       OR (LOWER(name) = LOWER('Peter Coulson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAuwb78B8XQx_C0DX5QZmF4eqynyaDms8oU' )
);
-- Insert: Max Ebdy (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recEfMzFcIyfKzu32', 'Max Ebdy', NULL, 'https://www.linkedin.com/in/ACwAABdB_7cBM62q2SH3Vho3ZDP9K6meoahdCVc', 'Regional Sales Director', 'Singapore', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Onfido acquisition news. Great move for digital security!', 'We''re seeing some strong government sales talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.', 'Hope you''re settling into the Senior Sales Executive role well! How are you finding the government sector''s response to enhanced identity verification solutions? We''re seeing some interesting shifts in the talent market, particularly around enterprise sales hires in cybersecurity, especially with all the focus on AI-driven security threats lately.', '2025-09-20T06:41:38.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recEfMzFcIyfKzu32' 
       OR (LOWER(name) = LOWER('Max Ebdy') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABdB_7cBM62q2SH3Vho3ZDP9K6meoahdCVc' )
);
-- Insert: Jimmy Wang (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recEfXyn4cpUyvhOR', 'Jimmy Wang', NULL, 'https://www.linkedin.com/in/ACwAACR6moABzsa_EZsbxlgZadJgk8PyfyhwK5Y', 'Sales Manager', 'Greater Sydney Area, Australia', 'new', 'High', '', NULL, 'Saw Huntress hit the 10 year milestone. Congrats on the anniversary!', 'We''re working with some strong AE candidates in cybersecurity at the moment. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your team. How are you finding the cybersecurity talent market? We''re noticing some interesting shifts, particularly around AE hires with all the growth happening in security.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recEfXyn4cpUyvhOR' 
       OR (LOWER(name) = LOWER('Jimmy Wang') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACR6moABzsa_EZsbxlgZadJgk8PyfyhwK5Y' )
);
-- Insert: Will Griffith (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recEyTd7dEORQMnVz', 'Will Griffith', NULL, 'https://www.linkedin.com/in/ACwAAAApjv8BZppnh4puYzrxFdpefiFqGKLoZ8k', 'GM and Head of GTM APAC', 'Greater Sydney Area, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw Sprout Social smashed earnings expectations. Love seeing that growth momentum!', 'We''re working with some strong enterprise sales leaders at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling in APAC.', 'I see you''re building out enterprise sales in Australia. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Senior Sales Manager hires in SaaS.', '2025-09-17T14:32:06.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recEyTd7dEORQMnVz' 
       OR (LOWER(name) = LOWER('Will Griffith') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAApjv8BZppnh4puYzrxFdpefiFqGKLoZ8k' )
);
-- Insert: Cam O''Riordan (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recEzGaiHYLuuv6AP', 'Cam O''Riordan', NULL, 'https://www.linkedin.com/in/camoriordan', 'VP Sales and Revenue', 'Sydney, Australia', 'new', 'High', '', NULL, 'Saw the Rugby Football League results. 85% completion rate across 5,000+ learners is impressive!', 'We''re working with some excellent CSM candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your customer success team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around CSM hires in edtech and learning platforms.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recEzGaiHYLuuv6AP' 
       OR (LOWER(name) = LOWER('Cam O''Riordan') OR linkedin_url = 'https://www.linkedin.com/in/camoriordan' )
);
-- Insert: Clayton Bennell ☁️ (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recF1XZSgkqaHKVFk', 'Clayton Bennell ☁️', NULL, 'https://www.linkedin.com/in/clayton-bennell-☁️-627aa258', 'Senior Sales Executive - Associate Director - Microsoft Government & Enterprise Accounts ANZ', 'Melbourne, Australia', 'new', NULL, '', NULL, 'Love seeing KPMG''s digital transformation completion. Moving to cloud is a big win.', 'Hope you''re well! We''re working with some experienced Salesforce leaders at the moment. Happy to chat if useful.', 'I see KPMG is hiring a Salesforce Director. How are you finding the search? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recF1XZSgkqaHKVFk' 
       OR (LOWER(name) = LOWER('Clayton Bennell ☁️') OR linkedin_url = 'https://www.linkedin.com/in/clayton-bennell-☁️-627aa258' )
);
-- Insert: Damon Scarr (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recF2IC4BHBgPJmxG', 'Damon Scarr', NULL, 'https://www.linkedin.com/in/damonscarr', 'General Manager, Asia Pacific at Sage', 'Sydney, Australia', 'new', 'High', '', NULL, 'Saw the AI-first strategy announcement at Sage Future 2025. Love the direction you''re heading!', 'We''re working with some excellent SDR candidates in the finance software space at the moment. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your team. How are you finding the market for SDRs in finance software across APAC? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in fintech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recF2IC4BHBgPJmxG' 
       OR (LOWER(name) = LOWER('Damon Scarr') OR linkedin_url = 'https://www.linkedin.com/in/damonscarr' )
);
-- Insert: Daniel Skaler (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recF2IE7TURv5zWKE', 'Daniel Skaler', NULL, 'https://www.linkedin.com/in/daniel-skaler-8ba8519', 'National iRetail Key Account Manager', 'Melbourne, Australia', 'new', 'Medium', '', NULL, 'Love seeing the iF Design Award win for the WISE-IoT solution. Great recognition!', 'Hope you''re well! We''re working with some experienced Key Account Managers at the moment. Happy to chat if useful.', 'I see you''re hiring a Key Account Manager at Advantech. How''s it going? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recF2IE7TURv5zWKE' 
       OR (LOWER(name) = LOWER('Daniel Skaler') OR linkedin_url = 'https://www.linkedin.com/in/daniel-skaler-8ba8519' )
);
-- Insert: Dan Franklin (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recF9izJdT0hkL97c', 'Dan Franklin', NULL, 'https://www.linkedin.com/in/ACwAAA0FUvABwDeQ2fjqPTgKNWXlwefMopbUXro', 'Director, Regional Sales, AU/NZ', 'Greater Adelaide Area, Australia', 'new', 'High', '', NULL, 'Saw the SpaceX satellite launch news. Love seeing the constellation expansion!', 'We''re working with some great SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.', 'I see you''re building out your sales team. How are you finding the market for SDR talent? We''re noticing some interesting shifts in the IoT space, particularly around early stage sales hires.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recF9izJdT0hkL97c' 
       OR (LOWER(name) = LOWER('Dan Franklin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA0FUvABwDeQ2fjqPTgKNWXlwefMopbUXro' )
);
-- Insert: Onur Dincer (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recFPoGRmiBcNmSui', 'Onur Dincer', NULL, 'https://www.linkedin.com/in/onur-dincer-a115881', 'Regional Sales Leader -Japan, Korea & Queensland', 'Brisbane, Australia', 'messaged', 'High', 'LinkedIn Job Posts', NOW(), 'Saw the Cisco Live announcements about the AI Assistant integration. Exciting developments for ThousandEyes!', 'We''re working with some strong regional sales managers in the observability and network monitoring space. Companies like HubSpot and Docusign have found our approach helpful when scaling across APAC markets.', 'I see you''re building out your regional sales team across ANZ, ASEAN and China. How are you finding the market? With all the new AI capabilities and platform expansions, we''re seeing increased demand for experienced sales talent in the observability space.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recFPoGRmiBcNmSui' 
       OR (LOWER(name) = LOWER('Onur Dincer') OR linkedin_url = 'https://www.linkedin.com/in/onur-dincer-a115881' )
);
-- Insert: Matt Carter (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recFTJ0dNMTahCXz8', 'Matt Carter', NULL, 'https://www.linkedin.com/in/mrc102', 'Enterprise Sales', 'Sydney, Australia', 'new', 'Medium', '', NULL, 'Saw the Microsoft Teams Unify certification news. Being the first independent vendor is huge. Congrats!', 'We''re working with some excellent CSM candidates with enterprise experience at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their customer success teams.', 'I see you''re building out your customer success team. How are you finding the CSM talent market in Melbourne? We''re noticing some interesting shifts in the customer success space, particularly around enterprise CSM hires in contact centre tech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recFTJ0dNMTahCXz8' 
       OR (LOWER(name) = LOWER('Matt Carter') OR linkedin_url = 'https://www.linkedin.com/in/mrc102' )
);
-- Insert: Chloe Frost (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recFVJJnnlMYUpNGu', 'Chloe Frost', NULL, 'https://www.linkedin.com/in/ACwAAATOy8oBGBIxKGKvs2pKBnzsUUPqxI1fb04', 'Senior Sales Director - APAC, at Info-Tech Research Group', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the growth Info-Tech is seeing. The Leadership Summit programs look great!', 'We''re working with some excellent senior account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.', 'I see you''re building out your account management team. How are you finding the talent market for senior AMs in Sydney? We''re noticing some interesting shifts in the landscape, particularly around enterprise account management hires in the IT services space.', '2025-09-25T05:15:21.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recFVJJnnlMYUpNGu' 
       OR (LOWER(name) = LOWER('Chloe Frost') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATOy8oBGBIxKGKvs2pKBnzsUUPqxI1fb04' )
);
-- Insert: Tercio Couceiro (REPLIED)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recFVqOV6GbpEGK3L', 'Tercio Couceiro', NULL, 'https://www.linkedin.com/in/tcouceiro', 'Senior Sales Director', 'Melbourne, Australia', 'replied', 'High', 'LinkedIn Job Posts', NOW(), 'Saw the breakthrough H1 results. 30% ARR growth is impressive!', 'We''re working with some strong presales candidates in the AI space.', 'I see you''re hiring a Presales Consultant for AI Growth at IFS. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recFVqOV6GbpEGK3L' 
       OR (LOWER(name) = LOWER('Tercio Couceiro') OR linkedin_url = 'https://www.linkedin.com/in/tcouceiro' )
);
-- Insert: Jade Marishel GAICD (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recFYbTUhsrbBmp6K', 'Jade Marishel GAICD', NULL, 'https://www.linkedin.com/in/ACwAAAgYWagBvtREM89QnXm5qpQARI8g2G13r50', 'Head of Sales, APAC', 'Sydney, Australia', 'new', 'High', '', NULL, 'Saw the ADS Solutions partnership news. Great move expanding into wholesale distribution.', 'We''re working with some strong technical presales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful for specialized sales roles.', 'I see you''re building out your team. How are you finding the technical presales market? We''re noticing some interesting shifts in the talent landscape, particularly around technical sales hires in data analytics.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recFYbTUhsrbBmp6K' 
       OR (LOWER(name) = LOWER('Jade Marishel GAICD') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAgYWagBvtREM89QnXm5qpQARI8g2G13r50' )
);
-- Insert: Scott Smedley (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recFfzpLJUN32iooi', 'Scott Smedley', NULL, 'https://www.linkedin.com/in/ACwAAAA9EIEBGPlCaGHKHov3-n3mR4O_vgOu6Pg', 'Head of Sales and Go to Market Australia and New Zealand', 'Greater Melbourne Area', 'in queue', 'High', 'LinkedIn Job Posts', '2025-09-23T06:53:32.901Z', 'Love the ANZ expansion strategy. Great move into the region!', 'We''re working with some excellent Client Account Executive candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise sales teams.', 'I see you''re building out your Client Account Executive team. How are you finding the talent market with all the expansion happening? We''re noticing some interesting shifts in the market, particularly around enterprise sales hires in the data transformation space. The demand for experienced AEs who understand complex B2B sales cycles has really picked up.', '2025-09-22T14:18:39.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recFfzpLJUN32iooi' 
       OR (LOWER(name) = LOWER('Scott Smedley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAA9EIEBGPlCaGHKHov3-n3mR4O_vgOu6Pg' )
);
-- Insert: James Meischke (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recFm9AwEgS2K4Eks', 'James Meischke', NULL, 'https://www.linkedin.com/in/jamesmeischke', 'National Sales Manager', 'Sydney, Australia', 'new', 'High', '', NULL, 'Saw Ordermentum hit $2 billion in transactions. That''s huge! Congrats on the milestone.', 'Hope you''re well! We''re working with some strong Sales Enablement candidates at the moment. Happy to chat if useful.', 'I see you''re hiring a Sales Enablement Manager at Ordermentum. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recFm9AwEgS2K4Eks' 
       OR (LOWER(name) = LOWER('James Meischke') OR linkedin_url = 'https://www.linkedin.com/in/jamesmeischke' )
);
-- Insert: Sarah Rowley (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recFqSeEcsM0Ke8MT', 'Sarah Rowley', NULL, 'https://www.linkedin.com/in/ACwAAAV9TdcBAIRl3VJyUwn3KS2pGWj5QqajpHE', 'Senior Product Manager, Issuing', 'Greater Sydney Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Indue acquisition news. Big move for the payments space!', 'We''re working with some excellent BD candidates in the payments space at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the landscape, particularly around Business Development hires in payments. With all the growth happening at Cuscal, I imagine finding the right people is pretty crucial right now.', '2025-09-29T14:22:57.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recFqSeEcsM0Ke8MT' 
       OR (LOWER(name) = LOWER('Sarah Rowley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAV9TdcBAIRl3VJyUwn3KS2pGWj5QqajpHE' )
);
-- Insert: Tony Spencer (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recFxsZZQpQlugE64', 'Tony Spencer', NULL, 'https://www.linkedin.com/in/ACwAAADsZLcBJKcinOvAXKxXZXnX6uBDWxqTLbw', 'Area Manager - North QLD', 'North Mackay, Queensland, Australia', 'new', 'High', '', NULL, 'Saw the Toustone acquisition news. Great move expanding into data analytics!', 'We''re working with some experienced Sales Executives in the resources space at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.', 'I see you''re building out your team. How are you finding the market for senior sales talent in the resources sector? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Executive hires in mining and ERP.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recFxsZZQpQlugE64' 
       OR (LOWER(name) = LOWER('Tony Spencer') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADsZLcBJKcinOvAXKxXZXnX6uBDWxqTLbw' )
);
-- Insert: Matthew Lowe (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recG9dGhxLLYtIpFe', 'Matthew Lowe', NULL, 'https://www.linkedin.com/in/matthew-lowe-1722357', 'Regional Director, Pacific', 'Sydney, Australia', 'messaged', 'Medium', 'LinkedIn Job Posts', NOW(), 'Saw the RSA Conference awards news. Congrats on the three wins!', 'We''re working with some strong SDR candidates in the cybersecurity space. Happy to chat if useful.', 'I see you''re hiring SDRs across Australia and Singapore. How are you finding the market? We work with companies like HubSpot on similar partner roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recG9dGhxLLYtIpFe' 
       OR (LOWER(name) = LOWER('Matthew Lowe') OR linkedin_url = 'https://www.linkedin.com/in/matthew-lowe-1722357' )
);
-- Insert: Carly Roper (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recGA0gV1wIachk0t', 'Carly Roper', NULL, 'https://www.linkedin.com/in/ACwAAAEUaeMBmM10JokHFgt5BftA6MD-ojBQR_I', 'Vice President - Sales ANZ', 'Melbourne, Victoria, Australia', 'in queue', 'High', 'LinkedIn Job Posts', '2025-09-30T05:18:26.407Z', 'Saw the Simpro Marketplace launch from Brisbane. That''s exciting!', 'We''re working with some excellent Enterprise Account Manager candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in competitive markets.', 'I see you''re building out your team. How are you finding the market for enterprise sales talent? We''re noticing some interesting shifts in the talent landscape, particularly around Account Manager hires in field service software. The growth at Simpro with the marketplace launch and Simprosium coming up must be creating some great opportunities.', '2025-09-29T14:20:11.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recGA0gV1wIachk0t' 
       OR (LOWER(name) = LOWER('Carly Roper') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEUaeMBmM10JokHFgt5BftA6MD-ojBQR_I' )
);
-- Insert: Gareth Moore (CONNECTED)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recGGTsczhOxZfQiX', 'Gareth Moore', NULL, 'https://www.linkedin.com/in/gareth-moore-479b453', 'Head of Sales - ERP', 'Sydney, Australia', 'connected', 'High', 'LinkedIn Job Posts', NOW(), 'Saw the Sage Intacct 2025 Release 2 news. Love the AI automation features!', 'We''re working with some excellent SDR candidates in the ERP space at the moment. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your team. How are you finding the market for SDRs in ERP and finance software? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in enterprise software.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recGGTsczhOxZfQiX' 
       OR (LOWER(name) = LOWER('Gareth Moore') OR linkedin_url = 'https://www.linkedin.com/in/gareth-moore-479b453' )
);
-- Insert: Henry Zhou (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recGHwJVwIQDYKiXu', 'Henry Zhou', NULL, 'https://www.linkedin.com/in/ACwAAAKQkroBpUiARR_xTuGn672dW1aRVUEWDIY', 'Managing Director', 'Greater Sydney Area, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the news about the new PoC Centre at Western Sydney Uni. That''s exciting!', 'We''re working with some great Sales Engineers in automation at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.', 'I see you''re building out your team. How are you finding the technical sales market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Engineer hires in automation and robotics.', '2025-09-17T14:37:29.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recGHwJVwIQDYKiXu' 
       OR (LOWER(name) = LOWER('Henry Zhou') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKQkroBpUiARR_xTuGn672dW1aRVUEWDIY' )
);
-- Insert: Jarod Hart (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recGckz5fgUb6GS8A', 'Jarod Hart', NULL, 'https://www.linkedin.com/in/jarod-hart', 'Sales Manager', 'Sydney, Australia', 'new', 'High', '', NULL, 'Love seeing the Sport:80 partnership announcement. Great move into sports organizations.', 'We''re working with some excellent CSM candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the edtech market? We''re noticing some interesting shifts in the talent landscape, particularly around CSM hires in learning platforms.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recGckz5fgUb6GS8A' 
       OR (LOWER(name) = LOWER('Jarod Hart') OR linkedin_url = 'https://www.linkedin.com/in/jarod-hart' )
);
-- Insert: Cherie Chay (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recGctl9jI3NHa1bc', 'Cherie Chay', NULL, 'https://www.linkedin.com/in/cheriechay', 'HR Business Partner, ASEAN & Greater China', 'Singapore, Singapore', 'new', 'High', '', NULL, 'Congrats on closing the AIB Merchant Services acquisition! That''s fantastic news for the European expansion.', 'We''re working with some excellent Sales Director candidates across fintech.', 'I see you''re building out your team for Fiserv. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in fintech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recGctl9jI3NHa1bc' 
       OR (LOWER(name) = LOWER('Cherie Chay') OR linkedin_url = 'https://www.linkedin.com/in/cheriechay' )
);
-- Insert: David Barrow (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recGh32zdTsK3iNW3', 'David Barrow', NULL, 'https://www.linkedin.com/in/ACwAABAkj64B4ddLP85lR_pcQnJdH2I1ipbMmY8', 'Director', 'Greater Melbourne Area', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-25T02:32:59.272Z', 'Saw the 2025 compliance focus. Smart positioning for the market!', 'We''re working with some excellent AE candidates in the compliance tech space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Melbourne teams.', 'I see you''re building out your AE team. How are you finding the Melbourne talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in the compliance and GRC space. With Sentrient''s growth to 600+ clients, I imagine you''re seeing strong demand for experienced SaaS AEs who understand the regulatory environment.', '2025-09-23T14:25:17.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recGh32zdTsK3iNW3' 
       OR (LOWER(name) = LOWER('David Barrow') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABAkj64B4ddLP85lR_pcQnJdH2I1ipbMmY8' )
);
-- Insert: Claudia Kidd (LEAD LOST)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recGq60bpkBg7QcGi', 'Claudia Kidd', NULL, 'https://www.linkedin.com/in/claudia-loritsch-0028', 'Strategic Growth Lead', 'Malvern, Australia', 'lead_lost', 'Medium', 'LinkedIn Job Posts', NOW(), 'Congrats on the UNICEPTA integration and becoming the third largest comms tech suite globally! That''s fantastic news.', 'We''re working with some excellent partnerships candidates across enterprise software.', 'I see you''re building out your team for Prophet. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around partnerships hires in enterprise software.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recGq60bpkBg7QcGi' 
       OR (LOWER(name) = LOWER('Claudia Kidd') OR linkedin_url = 'https://www.linkedin.com/in/claudia-loritsch-0028' )
);
-- Insert: Darren Paterson (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recGqwuyhBGmACZHD', 'Darren Paterson', NULL, 'https://www.linkedin.com/in/ACwAAAFnAbABB6kXiXPhSquzADLJ7M1418CsD2A', 'Regional Vice President of Sales, Australia and New Zealand', 'Sydney, New South Wales, Australia', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-10-01T23:28:18.243Z', 'Saw the SUGCON ANZ 2025 news. Exciting to see Sitecore leading in Sydney!', 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their new business teams.', 'I see you''re building out your SDR team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around new business development hires in Sydney. The SUGCON event should bring some great networking opportunities too. Would love to chat about what we''re seeing in the market.', '2025-10-01T14:15:43.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recGqwuyhBGmACZHD' 
       OR (LOWER(name) = LOWER('Darren Paterson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFnAbABB6kXiXPhSquzADLJ7M1418CsD2A' )
);
-- Insert: Aaron Berthelot (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recGspGlgPaPi8pZS', 'Aaron Berthelot', NULL, 'https://www.linkedin.com/in/ACwAAATzHfkBxxd1rkUUDAwDjv5X9t_Vpi6hn1g', 'Senior General Manager - Consumer Sales & Marketing Oceania', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the new warranty launch for Melbourne. Great customer focus!', 'We''re working with some excellent enterprise AE candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.', 'I see Canon''s been actively building out the Melbourne team. How are you finding the local talent market? We''re noticing some interesting shifts around enterprise AE hires in the tech space, particularly with companies expanding their direct customer engagement like Canon''s been doing.', '2025-09-20T06:29:31.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recGspGlgPaPi8pZS' 
       OR (LOWER(name) = LOWER('Aaron Berthelot') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATzHfkBxxd1rkUUDAwDjv5X9t_Vpi6hn1g' )
);
-- Insert: Paul Richardson (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recGtvdPnf9opfDzs', 'Paul Richardson', NULL, 'https://www.linkedin.com/in/ACwAAA3WGk0BrLm9zH0msivV2hPTCBaIPhvphYA', 'Chief Commercial Officer (CCO)', 'Greater Sydney Area', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-24T01:31:52.565Z', 'Love the ZAAP school partnerships launch. Smart move in the NSW market!', 'We''re working with some excellent partnerships and enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their partnerships teams in competitive markets.', 'I see you''re building out your partnerships team. How are you finding the market for enterprise sales talent? We''re noticing some interesting shifts in the talent landscape, particularly around partnerships and enterprise sales hires in the payments space. The demand for experienced professionals who understand both the technical and relationship sides has really picked up.', '2025-09-23T14:20:14.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recGtvdPnf9opfDzs' 
       OR (LOWER(name) = LOWER('Paul Richardson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA3WGk0BrLm9zH0msivV2hPTCBaIPhvphYA' )
);
-- Insert: Sesh Jayasuriya (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recGyf7hoIO3QfrMP', 'Sesh Jayasuriya', NULL, 'https://www.linkedin.com/in/ACwAAAlVBVoB0gzz0U88FjUwi5UzcRpK87z9a10', 'Regional Director APAC', 'Greater Sydney Area, Australia', 'new', 'High', '', NULL, 'Saw the $300M ARR news. That''s huge for ClickUp!', 'We''re working with some great SMB AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your SMB team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in productivity software with all the growth happening.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recGyf7hoIO3QfrMP' 
       OR (LOWER(name) = LOWER('Sesh Jayasuriya') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAlVBVoB0gzz0U88FjUwi5UzcRpK87z9a10' )
);
-- Insert: Shannon King (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recH2FMa9Axddx20M', 'Shannon King', NULL, 'https://www.linkedin.com/in/shannon-king-284247209', 'Region Manager - EOR HR Services - APAC', 'Bendigo, Australia', 'new', 'High', '', NULL, 'Saw the Series G news. $450M is huge - congrats!', 'We''re working with some strong Sales Development talent in APAC at the moment. ', 'I see you''re hiring a Sales Development Manager at Rippling. How are you finding the APAC market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recH2FMa9Axddx20M' 
       OR (LOWER(name) = LOWER('Shannon King') OR linkedin_url = 'https://www.linkedin.com/in/shannon-king-284247209' )
);
-- Insert: Mario Leonidou (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recH8gjwvYpuUr7wP', 'Mario Leonidou', NULL, 'https://www.linkedin.com/in/mario-leonidou-37189782', 'Head of Internal Sales', 'Sydney, Australia', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), 'Saw the news about Lumi Assistant winning those innovation awards. Congrats on the recognition!', 'We''re working with some excellent AE candidates in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the fintech talent market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in financial services.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recH8gjwvYpuUr7wP' 
       OR (LOWER(name) = LOWER('Mario Leonidou') OR linkedin_url = 'https://www.linkedin.com/in/mario-leonidou-37189782' )
);
-- Insert: Dallen Yi Zhao Long (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recHfZnwd7umrGemh', 'Dallen Yi Zhao Long', NULL, 'https://www.linkedin.com/in/ACwAAFc9WaUBmnvt216HmUTQuePCDZ9NbBd3P1E', 'Sales Manager', 'Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Sydney Work Innovation Summit. That''s exciting stuff!', 'We''re working with some excellent BDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during their local expansion phases.', 'I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the landscape, particularly around BDR hires in the collaborative work management space.', '2025-09-28T03:53:29.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recHfZnwd7umrGemh' 
       OR (LOWER(name) = LOWER('Dallen Yi Zhao Long') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAFc9WaUBmnvt216HmUTQuePCDZ9NbBd3P1E' )
);
-- Insert: Julian Lock (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recHq1ZqkBSyTEe94', 'Julian Lock', NULL, 'https://www.linkedin.com/in/ACwAAAEwvkQBLlxtnjb21fPWmyLZs0tTGTTsEEc', 'Senior Sales Director - APAC', 'Greater Brisbane Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the established Sydney presence and APAC growth focus!', 'We''re working with some excellent senior account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their advisory and client success teams.', 'I see you''re building out your team. How are you finding the talent market for senior account management roles? We''re noticing some interesting shifts in the IT consulting space, particularly around candidates who can balance research advisory with client growth in Sydney.', '2025-09-25T05:15:21.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recHq1ZqkBSyTEe94' 
       OR (LOWER(name) = LOWER('Julian Lock') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEwvkQBLlxtnjb21fPWmyLZs0tTGTTsEEc' )
);
-- Insert: Robert G. (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recHs0etnpI9cElmV', 'Robert G.', NULL, 'https://www.linkedin.com/in/robogibson', 'General Manager - APAC', 'Adelaide, Australia', 'messaged', 'Medium', 'LinkedIn Job Posts', NOW(), 'Saw the rebrand to Clearer.io. Love the new direction!', 'We''re working with some strong Customer Success candidates at the moment.', 'I see you''re hiring a Customer Success Lead at Clearer.io. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recHs0etnpI9cElmV' 
       OR (LOWER(name) = LOWER('Robert G.') OR linkedin_url = 'https://www.linkedin.com/in/robogibson' )
);
-- Insert: Jose Alba (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recHslXwMye6iGi9o', 'Jose Alba', NULL, 'https://www.linkedin.com/in/ACwAAABp0P4BizQ4PIl1EYubzv36gMz8P23im3c', 'Regional Alliances Manager', 'Greater Sydney Area, Australia', 'new', 'Medium', '', NULL, 'Saw the Qlik Connect 2025 launch. Love the new AI capabilities you''re rolling out.', 'We''re working with some strong Enterprise AE candidates in the data space at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your Enterprise AE team in Sydney. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in data and analytics.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recHslXwMye6iGi9o' 
       OR (LOWER(name) = LOWER('Jose Alba') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABp0P4BizQ4PIl1EYubzv36gMz8P23im3c' )
);
-- Insert: Dylan Clough (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recHz7QcPhQjYtlC3', 'Dylan Clough', NULL, 'https://www.linkedin.com/in/ACwAACtzQOoBZCrnudu08ui52_pDqNVyVbM83ZI', 'Sales Director', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the new 2-year warranty launch for the Arizona printers. Smart move!', 'We''re working with some excellent enterprise AE candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.', 'I see Canon''s been actively hiring in Melbourne lately. How are you finding the local talent market? We''re noticing some interesting shifts around enterprise sales hires, particularly with companies expanding their customer support and warranty offerings like Canon just did.', '2025-09-20T06:29:31.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recHz7QcPhQjYtlC3' 
       OR (LOWER(name) = LOWER('Dylan Clough') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACtzQOoBZCrnudu08ui52_pDqNVyVbM83ZI' )
);
-- Insert: Clare Bagoly (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recIYbf9CYlArBDrZ', 'Clare Bagoly', NULL, 'https://www.linkedin.com/in/ACwAAAgoZ6UB1K_OAxoCglQ0rqMtB7d7cjL4cqE', 'Head of Sales Development', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Congrats on the $250M ARR milestone in Feb!', 'We''re working with some excellent inbound SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during these high growth phases.', 'I see you''re building out your SDR team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around inbound SDR hires in the HR tech space. The growth you''re seeing must be creating some exciting opportunities but also some hiring challenges.', '2025-09-28T03:59:33.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recIYbf9CYlArBDrZ' 
       OR (LOWER(name) = LOWER('Clare Bagoly') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAgoZ6UB1K_OAxoCglQ0rqMtB7d7cjL4cqE' )
);
-- Insert: Anthony Connors (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recIiLd2Kcgx9ihbi', 'Anthony Connors', NULL, 'https://www.linkedin.com/in/ACwAABQIYM8B2OOUVKGURSjr4_DjDpVPccj-fcc', 'NSW Sales Manager at Mediaform Pty Ltd', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love seeing MediaForm''s presence across Sydney, Brisbane and Melbourne!', 'We''re working with some excellent Account Manager candidates in Brisbane at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.', 'I see you''re building out your Account Manager team in Brisbane. How are you finding the talent market for sales roles in the tech supply space? We''re noticing some interesting shifts, particularly around experienced Account Manager hires who understand the B2B technology sector.', '2025-09-23T14:29:59.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recIiLd2Kcgx9ihbi' 
       OR (LOWER(name) = LOWER('Anthony Connors') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABQIYM8B2OOUVKGURSjr4_DjDpVPccj-fcc' )
);
-- Insert: Victor Yong (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recIovhxLzLlXShW2', 'Victor Yong', NULL, 'https://www.linkedin.com/in/ACwAACsJ868BrutfqQXc1vOJWfwda-fnTYGVA8g', 'WA State Sales Manager', 'Perth, Western Australia, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the ATS acquisition news. Big move for Melbourne operations!', 'We''re working with some excellent sales candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.', 'I see you''re building out your team post acquisition. How are you finding the local talent market? We''re noticing some interesting shifts around sales hires in Melbourne, particularly with companies expanding their operations like Tyrolit.', '2025-09-25T05:21:44.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recIovhxLzLlXShW2' 
       OR (LOWER(name) = LOWER('Victor Yong') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACsJ868BrutfqQXc1vOJWfwda-fnTYGVA8g' )
);
-- Insert: Ash Rahman (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recIuYuzACMPttPna', 'Ash Rahman', NULL, 'https://www.linkedin.com/in/ACwAABDg628B_Y-v7llDQ3Y0hxHvSxpnaRgZFkc', 'Sales Director', 'Melbourne, Victoria, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Sydney partner bootcamps in May. Exciting local growth!', 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team with all the local expansion happening. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the market, particularly around Account Executive hires in identity security.', '2025-09-23T14:16:10.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recIuYuzACMPttPna' 
       OR (LOWER(name) = LOWER('Ash Rahman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABDg628B_Y-v7llDQ3Y0hxHvSxpnaRgZFkc' )
);
-- Insert: Nicole Daley (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recJ5XhyhUN201IDx', 'Nicole Daley', NULL, 'https://www.linkedin.com/in/nicole-daley-28953496', 'Group Sales Manager (Non-Endemic), AUNZ - Amazon Ads', 'Queenscliff, Australia', 'new', 'High', '', NULL, 'Saw the Anthropic partnership news. That''s a huge move for Amazon!', 'Hope you''re well! We''re working with some strong Account Manager candidates at the moment. Happy to chat if useful.', 'I see you''re hiring Account Managers at Amazon. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recJ5XhyhUN201IDx' 
       OR (LOWER(name) = LOWER('Nicole Daley') OR linkedin_url = 'https://www.linkedin.com/in/nicole-daley-28953496' )
);
-- Insert: Louis Whelan (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recJHUBH1s3fMpLfK', 'Louis Whelan', NULL, 'https://www.linkedin.com/in/ACwAABHrwZMB9yI9VFTGNQzzfG_CFwGKWzxSOt0', 'Head of Sales', 'Australia', 'messaged', 'High', 'LinkedIn Job Posts', NOW(), 'Saw the Zeller for Startups launch. Love seeing you tackle those banking pain points for founders.', 'We''re working with some strong mid-market AEs in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the fintech talent market? We''re noticing some interesting shifts in the landscape, particularly around mid-market AE hires targeting the startup space.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recJHUBH1s3fMpLfK' 
       OR (LOWER(name) = LOWER('Louis Whelan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABHrwZMB9yI9VFTGNQzzfG_CFwGKWzxSOt0' )
);
-- Insert: Thana Jahairam (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recJHUBmRntO3bBl0', 'Thana Jahairam', NULL, 'https://www.linkedin.com/in/thana-jay-1986mar31', 'Human Resources Generalist APAC', 'Gaythorne, Australia', 'new', 'Medium', '', NULL, 'Saw the Sirius Solutions acquisition news. Great move to expand your transformation capabilities!', 'Hope you''re well! We''re working with some strong CSM candidates at the moment. Happy to chat if useful.', 'I see you''re hiring a CSM at eTeam. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recJHUBmRntO3bBl0' 
       OR (LOWER(name) = LOWER('Thana Jahairam') OR linkedin_url = 'https://www.linkedin.com/in/thana-jay-1986mar31' )
);
-- Insert: Wei Li Lim (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recJOdicG5FDEdbOI', 'Wei Li Lim', NULL, 'https://www.linkedin.com/in/ACwAABsPiCwBrG8YQ12Wce-tKg4K7Ov4oAsuKog', 'Revenue Operations', 'Sydney, New South Wales, Australia', 'in queue', 'Medium', 'LinkedIn Job Posts', '2025-09-21T23:26:40.237Z', 'Saw the Workforce launch in Sydney. 40k agents created is incredible!', 'We''re working with some excellent enterprise AE candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams during rapid growth phases.', 'I see you''re scaling the enterprise team at Relevance AI. How are you finding the Sydney talent market for senior AE hires? We''re noticing some interesting shifts in the enterprise sales landscape, particularly around AI platform companies expanding locally. The growth you''re seeing with 40,000 agents created must be creating some exciting opportunities on the sales side.', '2025-09-20T14:24:26.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recJOdicG5FDEdbOI' 
       OR (LOWER(name) = LOWER('Wei Li Lim') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABsPiCwBrG8YQ12Wce-tKg4K7Ov4oAsuKog' )
);
-- Insert: Craig Bastow (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recJQ7lsPrxs3f5y5', 'Craig Bastow', NULL, 'https://www.linkedin.com/in/ACwAAA3Eb3oBFH0AjvBXND_dkY9sIp6WXduZeR0', 'Area Vice President and Country Manager, Australia and New Zealand', 'Greater Brisbane Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the State of Data Readiness report for ANZ. Great insights!', 'We''re working with some excellent Strategic Account Executive candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise sales teams.', 'I see you''re building out your Strategic Account Executive team. How are you finding the talent market across the region? We''re noticing some interesting shifts around enterprise sales hiring in data security, particularly with the increased focus on cyber resilience that your recent report highlighted.', '2025-09-28T14:34:56.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recJQ7lsPrxs3f5y5' 
       OR (LOWER(name) = LOWER('Craig Bastow') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA3Eb3oBFH0AjvBXND_dkY9sIp6WXduZeR0' )
);
-- Insert: Prem Kumar (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recJVvzrbEFhRKw31', 'Prem Kumar', NULL, 'https://www.linkedin.com/in/ACwAACLVMZUBklKivFNcriWs9qSF_q4Yu3eTyDA', 'Regional Sales Manager ASEAN', 'Singapore', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Congrats on the Sydney office expansion. Love the local growth!', 'We''re working with some excellent AE candidates in the cybersecurity space at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in cybersecurity. With Darktrace doubling headcount locally, you must be seeing the demand firsthand.', '2025-09-22T14:21:33.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recJVvzrbEFhRKw31' 
       OR (LOWER(name) = LOWER('Prem Kumar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACLVMZUBklKivFNcriWs9qSF_q4Yu3eTyDA' )
);
-- Insert: Marea Ford (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recJXgwmNwlnNZK4l', 'Marea Ford', NULL, 'https://www.linkedin.com/in/ACwAABAJwk8BTuJfmCiI88ilN9dQ7i3O0_J135o', 'National Sales Manager', 'Greater Brisbane Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the Sydney growth at Silverwater. Exciting expansion!', 'We''re working with some excellent strategic account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney operations.', 'I see you''re building out your team with the National Strategic Account Manager role. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around senior sales hires in Sydney''s IT services sector.', '2025-09-25T05:13:11.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recJXgwmNwlnNZK4l' 
       OR (LOWER(name) = LOWER('Marea Ford') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABAJwk8BTuJfmCiI88ilN9dQ7i3O0_J135o' )
);
-- Insert: Sheree Springer (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recJkk1rNYiEzCxPh', 'Sheree Springer', NULL, 'https://www.linkedin.com/in/sheree-springer-713312118', 'Manager, Technical Account Management', 'Sydney, Australia', 'new', 'Medium', '', NULL, 'Saw the news about Mindbody and ClassPass unifying under Playlist. That''s exciting!', 'Hope you''re well! We''re working with some strong SMB sales candidates at the moment. Happy to chat if useful.', 'I see you''re hiring SMB Sales Specialists at Mindbody. How are you finding the market? We work with companies like HubSpot on similar outbound roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recJkk1rNYiEzCxPh' 
       OR (LOWER(name) = LOWER('Sheree Springer') OR linkedin_url = 'https://www.linkedin.com/in/sheree-springer-713312118' )
);
-- Insert: Kiran Mudunuru (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recJrf6jGiRdvWnVi', 'Kiran Mudunuru', NULL, 'https://www.linkedin.com/in/kiranmudunuru', 'Sales Director (DevOps, AI & Automation)', 'Melbourne, Australia', 'new', 'High', '', NULL, 'Love seeing the UnO platform launch. AI-powered orchestration looks exciting.', 'Hope you''re well! We''re working with some strong Sales Director candidates in enterprise software. Happy to chat if useful.', 'I see you''re hiring a Sales Director at HCL Software. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recJrf6jGiRdvWnVi' 
       OR (LOWER(name) = LOWER('Kiran Mudunuru') OR linkedin_url = 'https://www.linkedin.com/in/kiranmudunuru' )
);
-- Insert: Will van Schaik (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recJxv4GcazALbfSm', 'Will van Schaik', NULL, 'https://www.linkedin.com/in/ACwAABLBMIEBBX6aqIpFyxL5kJNXFYlFsJK2NLE', 'Sales Manager', 'Elwood, Victoria, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Love the Sydney office expansion at Australia Square!', 'We''re working with some excellent Account Manager candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during their expansion phases.', 'I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the market, particularly around Account Manager hires in the data security space. With your new office opening, I imagine you''re looking to scale locally. Would love to chat about what we''re seeing in the market.', '2025-09-23T14:23:21.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recJxv4GcazALbfSm' 
       OR (LOWER(name) = LOWER('Will van Schaik') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABLBMIEBBX6aqIpFyxL5kJNXFYlFsJK2NLE' )
);
-- Insert: Todd Wellard (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recJyMca1dd1rZ7KR', 'Todd Wellard', NULL, 'https://www.linkedin.com/in/ACwAAABK3C4BCoyqBabJEkd-lgMlA6BrcN53iOg', 'Regional Sales Director - ANZ', 'Sydney, Australia', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), 'Saw Securiti made CRN''s 20 Coolest Network Security Companies list. Congrats on the recognition!', 'We''re working with some strong channel sales candidates in cybersecurity at the moment. We''ve helped companies like HubSpot and Docusign build out their teams.', 'I see you''re building out your team. How are you finding the ANZ market for channel sales talent? We''re noticing some interesting shifts in the cybersecurity space, particularly around Channel Sales Manager hires.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recJyMca1dd1rZ7KR' 
       OR (LOWER(name) = LOWER('Todd Wellard') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABK3C4BCoyqBabJEkd-lgMlA6BrcN53iOg' )
);
-- Insert: Janelle Havill (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recK2wLxAill7suvH', 'Janelle Havill', NULL, 'https://www.linkedin.com/in/ACwAABLVLPQBojhbU1IAhtwpQGm94qKS2mHrv40', 'Head of Sales Development ', 'Greater Sydney Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Australia Square office expansion. Great Sydney presence!', 'We''re working with some excellent AE candidates in the employee engagement space at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in employee engagement. The Sydney market has been quite active lately.', '2025-09-28T14:25:26.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recK2wLxAill7suvH' 
       OR (LOWER(name) = LOWER('Janelle Havill') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABLVLPQBojhbU1IAhtwpQGm94qKS2mHrv40' )
);
-- Insert: Allan Wang (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recK6TDaunmISiOU2', 'Allan Wang', NULL, 'https://www.linkedin.com/in/ACwAAAwclRIB7mIFiDcjfsuWmXJqAGe7r6h-7vk', 'Director of Sales, Australia and New Zealand', 'Barangaroo, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the State of Data Readiness report for ANZ. Great insights!', 'We''re working with some excellent Strategic Account Executive candidates in the data security space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise sales teams in competitive markets.', 'I see you''re building out your team in Victoria. How are you finding the talent market for data security roles? We''re noticing some interesting shifts, particularly around Strategic Account Executive hires in the cyber resilience space. The regulatory pressures you mentioned in the report are definitely driving demand for experienced professionals who understand compliance frameworks.', '2025-09-28T14:34:56.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recK6TDaunmISiOU2' 
       OR (LOWER(name) = LOWER('Allan Wang') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAwclRIB7mIFiDcjfsuWmXJqAGe7r6h-7vk' )
);
-- Insert: Damien Olbourne (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recK7kOdWqMqZN4wt', 'Damien Olbourne', NULL, 'https://www.linkedin.com/in/olbourne', 'Alliances Director, ANZ + ASEAN', 'Randwick, Australia', 'new', 'Medium', '', NULL, 'Saw the CopadoCon India success. That growth in the region must be exciting for you!', 'We''re working with some strong BDR candidates in the Salesforce ecosystem. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your BDR team. How are you finding the Salesforce talent market in ANZ? We''re noticing some interesting shifts in the landscape, particularly around BDR hires in the DevOps space.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recK7kOdWqMqZN4wt' 
       OR (LOWER(name) = LOWER('Damien Olbourne') OR linkedin_url = 'https://www.linkedin.com/in/olbourne' )
);
-- Insert: Kenny Soutar (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recK8450yDIedgSkm', 'Kenny Soutar', NULL, 'https://www.linkedin.com/in/ACwAAAAQq4EB4S4PwcwJHr_mzLqTtx3XvkjtSuA', 'Country Manager - ANZ', 'Greater Melbourne Area, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the GFL-1500 launch for solar technicians. That''s exciting stuff.', 'We''re working with some excellent technical sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their technical teams.', 'I see you''re building out your team. How are you finding the technical sales market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Application Manager hires in the testing and measurement space.', '2025-09-17T14:27:24.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recK8450yDIedgSkm' 
       OR (LOWER(name) = LOWER('Kenny Soutar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAQq4EB4S4PwcwJHr_mzLqTtx3XvkjtSuA' )
);
-- Insert: Fabian Teo (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recKHyrOzFsZMvr5K', 'Fabian Teo', NULL, 'https://www.linkedin.com/in/ACwAAAt4lU0BTAXs2v_U3qXhuslwguuYR2UBiks', 'Regional Sales Director', 'Singapore', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Congrats on the KuppingerCole leadership recognition!', 'We''re working with some excellent enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.', 'I see you''re building out your enterprise sales team. How are you finding the market for senior AE talent? We''re noticing some interesting shifts in the cybersecurity space, particularly around enterprise sales hires who can navigate complex identity solutions.', '2025-09-23T14:27:00.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recKHyrOzFsZMvr5K' 
       OR (LOWER(name) = LOWER('Fabian Teo') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAt4lU0BTAXs2v_U3qXhuslwguuYR2UBiks' )
);
-- Insert: Lisa Cunningham (CONNECTED)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recKKwV5jBWsJ6LtF', 'Lisa Cunningham', NULL, 'https://www.linkedin.com/in/ACwAACEsgmoBJFXd1zL7suOs9Td00oCW_z7RLlA', 'Head of Sales ', 'Brisbane, Queensland, Australia', 'connected', 'High', 'LinkedIn Job Posts', '2025-09-25T02:34:49.940Z', 'Congrats on the Great Place to Work certification!', 'We''re working with some excellent B2B sales candidates in Brisbane at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in competitive markets.', 'Hope you''re settling in well at aXcelerate! I see you''re building out the sales team there. How are you finding the Brisbane talent market? We''re noticing some interesting shifts around B2B sales hires in the edtech space, particularly with companies scaling their compliance and AI capabilities like aXcelerate is doing.', '2025-09-23T14:41:11.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recKKwV5jBWsJ6LtF' 
       OR (LOWER(name) = LOWER('Lisa Cunningham') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACEsgmoBJFXd1zL7suOs9Td00oCW_z7RLlA' )
);
-- Insert: Satory Li (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recKXDK3H2n3tujFw', 'Satory Li', NULL, 'https://www.linkedin.com/in/satory-li-541366102', 'Global Supply Chain Director', 'Sydney, Australia', 'new', 'Medium', '', NULL, 'Saw the Alpina partnership for APAC markets. That''s exciting growth.', 'We''re working with some excellent Senior Sales Managers in energy and cleantech at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re expanding the team in Sydney. How are you finding the energy storage talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Senior Sales Manager hires in cleantech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recKXDK3H2n3tujFw' 
       OR (LOWER(name) = LOWER('Satory Li') OR linkedin_url = 'https://www.linkedin.com/in/satory-li-541366102' )
);
-- Insert: Brett Watkins (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recKwQCjwa57vIBzg', 'Brett Watkins', NULL, 'https://www.linkedin.com/in/ACwAABgHb0UBzXDeyst7xQ6poDGpQP2mJfScVkU', 'National Sales Manager', 'Greater Melbourne Area', 'messaged', 'High', 'LinkedIn Job Posts', '2025-09-21T23:32:49.163Z', 'Saw the news about Christopher Smith joining as APAC MD. Exciting times ahead for Civica!', 'We''re working with some great AE candidates with local government experience. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.', 'I see you''re building out your team. How are you finding the local government market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in gov tech.', '2025-09-18T21:02:48.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recKwQCjwa57vIBzg' 
       OR (LOWER(name) = LOWER('Brett Watkins') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABgHb0UBzXDeyst7xQ6poDGpQP2mJfScVkU' )
);
-- Insert: Matt Crowe (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recLI9BRe2jyKSfRD', 'Matt Crowe', NULL, 'https://www.linkedin.com/in/ACwAAAA4aNgBgYkull3pYL9O6bhSXxZNTmDLa3g', 'Head of Sales and Strategy', 'Greater Sydney Area, Australia', 'new', 'High', '', NULL, 'Saw the NZ expansion news with Endeavour and Thyme. Great move into the Kiwi market!', 'We''re working with some experienced Partner Sales Managers at the moment. Companies like HubSpot and Docusign have found our approach helpful for channel roles.', 'I see you''re building out your partner sales team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Partner Sales Manager hires in ERP and tech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recLI9BRe2jyKSfRD' 
       OR (LOWER(name) = LOWER('Matt Crowe') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAA4aNgBgYkull3pYL9O6bhSXxZNTmDLa3g' )
);
-- Insert: Trent Lowe (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recLUnkkq22SdrpD9', 'Trent Lowe', NULL, 'https://www.linkedin.com/in/ACwAAAZOFqQBjMdrP0Rd-ZO8LC6gsDjnpFRwa00', 'Sales Director (Master Agent - CBA)', 'Brisbane City, Queensland, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the new warranty launch for Melbourne. Smart move!', 'We''re working with some excellent Account Executive candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in Melbourne. With Canon actively recruiting, I imagine you''re seeing the competition firsthand. Would love to chat about what we''re seeing in the market.', '2025-09-20T06:29:31.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recLUnkkq22SdrpD9' 
       OR (LOWER(name) = LOWER('Trent Lowe') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAZOFqQBjMdrP0Rd-ZO8LC6gsDjnpFRwa00' )
);
-- Insert: Darren E. (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recLVZQHsrmUoUQYt', 'Darren E.', NULL, 'https://www.linkedin.com/in/ACwAAAA9elABVoAqs8vN9lYLcwRS5chWg22MqwU', 'General Manager - Sales', 'Greater Melbourne Area, Australia', 'new', 'High', '', NULL, 'Saw the Blue Connections acquisition news. Congrats on the expansion!', 'We''re working with some great Sales Executives who have experience in high-growth environments. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your sales team. How are you finding the market with all the expansion activity? We''re seeing some interesting shifts in the talent landscape, particularly around Sales Executive hires for companies scaling through acquisitions.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recLVZQHsrmUoUQYt' 
       OR (LOWER(name) = LOWER('Darren E.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAA9elABVoAqs8vN9lYLcwRS5chWg22MqwU' )
);
-- Insert: Byron Rudenno (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recLYm4H6HdkSe0WY', 'Byron Rudenno', NULL, 'https://www.linkedin.com/in/ACwAAABJOhgBMxDrdpWxAv5izPepCIiU_Fs7K_8', 'Senior Vice President, Europe & Asia-Pacific', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw you''re hiring for Senior Account Manager. Exciting times!', 'We''re working with some excellent senior account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around senior account management hires in the research and advisory space.', '2025-09-25T03:27:02.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recLYm4H6HdkSe0WY' 
       OR (LOWER(name) = LOWER('Byron Rudenno') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABJOhgBMxDrdpWxAv5izPepCIiU_Fs7K_8' )
);
-- Insert: Jerry Sun (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recLrYuJMmjQhS0ig', 'Jerry Sun', NULL, 'https://www.linkedin.com/in/jerry-sun-259b63105', 'Sales Director', 'Singapore, Singapore', 'new', 'Medium', '', NULL, 'Love seeing the G2 recognition. Highest Performer is a great win!', 'Hope you''re well! We''re working with some strong Enterprise AE candidates in the ANZ region. Happy to chat if useful.', 'I see you''re hiring Enterprise AEs in ANZ at Zilliz. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recLrYuJMmjQhS0ig' 
       OR (LOWER(name) = LOWER('Jerry Sun') OR linkedin_url = 'https://www.linkedin.com/in/jerry-sun-259b63105' )
);
-- Insert: Belma Kubur (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recM1gtgUGa8R28gf', 'Belma Kubur', NULL, 'https://www.linkedin.com/in/ACwAAAxESIkBnOObybM8n6bjYULDM1Wb2Pd22dE', 'Head of Consultancy - New & Strategic Accounts', 'Greater Sydney Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Love seeing the Sydney HQ growth at Australia Square!', 'We''re working with some excellent AE candidates in the HR tech space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.', 'Hope you''re settling in well at Reward Gateway! I see you''re building out the sales team. How are you finding the local talent market? We''re noticing some interesting shifts around AE hires in the employee engagement space, particularly with companies expanding their Sydney operations like yours.', '2025-09-28T14:25:25.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recM1gtgUGa8R28gf' 
       OR (LOWER(name) = LOWER('Belma Kubur') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAxESIkBnOObybM8n6bjYULDM1Wb2Pd22dE' )
);
-- Insert: Damian Wrigley (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recM5hhRdhRrU6x6s', 'Damian Wrigley', NULL, 'https://www.linkedin.com/in/ACwAAALBzWoBh0bvRZ3l3aNQ-nM5VdzBqiEMYeA', 'Senior Sales Manager Australia, JustCo', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the King Street and Pitt Street locations. Impressive growth!', 'We''re working with some excellent sales executive candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in competitive markets.', 'I see you''re building out your sales team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around sales executive hires in the coworking space. The demand for experienced sales professionals who understand flexible workspace solutions has really picked up lately.', '2025-09-25T05:08:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recM5hhRdhRrU6x6s' 
       OR (LOWER(name) = LOWER('Damian Wrigley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAALBzWoBh0bvRZ3l3aNQ-nM5VdzBqiEMYeA' )
);
-- Insert: Shane Verner (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recMSnynlGE9Tdmod', 'Shane Verner', NULL, 'https://www.linkedin.com/in/ACwAAABt_AEBAUJbfkEeMtZK7xoPleWzukA84kM', 'A/NZ Sales Director', 'Melbourne, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the CloudTech partnership news. Love the Melbourne traction!', 'We''re working with some excellent sales directors at the moment. Companies like HubSpot and Docusign have found our approach helpful when expanding their local teams.', 'I see you''re building out your sales team in Victoria. How are you finding the local talent market? We''re noticing some interesting shifts around senior sales hires in fintech, particularly with companies scaling their presence in Melbourne.', '2025-09-21T14:10:14.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recMSnynlGE9Tdmod' 
       OR (LOWER(name) = LOWER('Shane Verner') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABt_AEBAUJbfkEeMtZK7xoPleWzukA84kM' )
);
-- Insert: Clare Stokes (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recMXk401GmZQWOqb', 'Clare Stokes', NULL, 'https://www.linkedin.com/in/stokesclare', 'Manager, Sales Development APJ', 'Sydney, Australia', 'new', 'Medium', '', NULL, 'Saw the monday magic AI tool launch. Love seeing the innovation at monday.com.', 'Hope you''re well! We''re working with some strong SDR Manager candidates at the moment. Happy to chat if useful.', 'I see you''re hiring an SDR Manager at monday.com. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recMXk401GmZQWOqb' 
       OR (LOWER(name) = LOWER('Clare Stokes') OR linkedin_url = 'https://www.linkedin.com/in/stokesclare' )
);
-- Insert: Kelly Johnson (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recMb6EA7q2mfloVL', 'Kelly Johnson', NULL, 'https://www.linkedin.com/in/ACwAAAAFSywB9AF90efV2fuZS2bBJ_HsjVzapyY', 'ANZ Regional Sales Manager', 'Greater Sydney Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the new Brisbane head office launch. That''s exciting growth!', 'We''re working with some excellent BDR candidates in Brisbane at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.', 'I see you''re in a BDR role with all the expansion happening. How are you finding the local talent market? We''re noticing some interesting shifts in the market, particularly around business development hires in Brisbane. With Pax8''s growth trajectory and the new office setup, I imagine you''re seeing some exciting opportunities. Would love to chat about what we''re seeing in the market.', '2025-10-01T14:22:35.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recMb6EA7q2mfloVL' 
       OR (LOWER(name) = LOWER('Kelly Johnson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAFSywB9AF90efV2fuZS2bBJ_HsjVzapyY' )
);
-- Insert: Jason Leonidas (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recMgAXb1t3I7yEpz', 'Jason Leonidas', NULL, 'https://www.linkedin.com/in/ACwAAABZDCMBts13j7W8PeHy0CIpHCNn5elQFaw', 'Regional Director, ANZ & South Asia ', 'Greater Melbourne Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the data residency launch. That''s a game changer for enterprise!', 'We''re seeing some excellent enterprise sales talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.', 'Hope you''re well Jason! I see GitHub is really doubling down on the enterprise space with the local data residency launch. How are you finding the market with all the regulated sector opportunities opening up? We''re noticing some interesting shifts in the talent market, particularly around enterprise sales hires in the tech space.', '2025-09-28T14:40:07.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recMgAXb1t3I7yEpz' 
       OR (LOWER(name) = LOWER('Jason Leonidas') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABZDCMBts13j7W8PeHy0CIpHCNn5elQFaw' )
);
-- Insert: Dave Illman (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recMh2ubzslvPKiPh', 'Dave Illman', NULL, 'https://www.linkedin.com/in/ACwAAAAkvKgBaMtznMOdYeE8BDEO8g1egFkXTNg', 'Regional Sales Manager - ANZ', 'Sydney, Australia', 'in queue', 'High', 'LinkedIn Job Posts', '2025-09-19T05:28:28.325Z', 'Saw the $50M funding news. Congrats on the Series C!', 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in SaaS data protection.', '2025-09-17T14:28:47.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recMh2ubzslvPKiPh' 
       OR (LOWER(name) = LOWER('Dave Illman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAkvKgBaMtznMOdYeE8BDEO8g1egFkXTNg' )
);
-- Insert: Ed Layton (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recMnJZ3ce1OoFnCx', 'Ed Layton', NULL, 'https://www.linkedin.com/in/ed-layton-27a886a', 'Head of Strategic Engagements Amazon Project Kuiper', 'Queenscliff, Australia', 'new', 'Medium', '', NULL, 'Saw the Anthropic partnership news. That''s exciting work at Project Kuiper!', 'Hope you''re well! We''re working with some strong Account Manager candidates at the moment. Happy to chat if useful.', 'I see you''re hiring Account Managers at Amazon. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recMnJZ3ce1OoFnCx' 
       OR (LOWER(name) = LOWER('Ed Layton') OR linkedin_url = 'https://www.linkedin.com/in/ed-layton-27a886a' )
);
-- Insert: Drew Plummer (LEAD LOST)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recMqudA13nOZPdb9', 'Drew Plummer', NULL, 'https://www.linkedin.com/in/ACwAABT3sRQBzDeovbX3dQCV7ypeVLMZG0k8jU8', 'Head of Sales, ANZ', 'Sydney, Australia', 'lead_lost', 'High', 'LinkedIn Job Posts', NOW(), 'Saw the ITEL acquisition news. That''s exciting growth for Nearmap!', 'We''re working with some great Commercial AEs in the insurance tech space. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the insurance tech talent market? We''re noticing some interesting shifts in the landscape, particularly around Commercial AE hires in proptech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recMqudA13nOZPdb9' 
       OR (LOWER(name) = LOWER('Drew Plummer') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABT3sRQBzDeovbX3dQCV7ypeVLMZG0k8jU8' )
);
-- Insert: Christina Mastripolito (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recMsLL1I1tbDnutc', 'Christina Mastripolito', NULL, 'https://www.linkedin.com/in/ACwAAByqKmAB0kSSsdsLLVoSBOcQZfTMluVgnOo', 'Customer Success Manager', 'Adelaide, South Australia, Australia', 'connection_requested', 'Medium', 'LinkedIn Job Posts', NOW(), 'Saw the Everoot Consulting acquisition news. Great move expanding the sustainability services.', 'We''re working with some excellent AE candidates in the APAC region at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.', 'I see you''re building out your APAC team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in professional services across Australia.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recMsLL1I1tbDnutc' 
       OR (LOWER(name) = LOWER('Christina Mastripolito') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAByqKmAB0kSSsdsLLVoSBOcQZfTMluVgnOo' )
);
-- Insert: Rino Crescitelli (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recMv8OvQtDdEFHBc', 'Rino Crescitelli', NULL, 'https://www.linkedin.com/in/rino-crescitelli-03a07b72', 'Sales Manager', 'Adelaide, Australia', 'new', 'High', '', NULL, 'Congrats on being named among the top 30 digital marketing agencies in Sydney for 2025! That''s fantastic recognition.', 'We''re working with some excellent Head of Sales candidates across digital marketing.', 'I see you''re building out your team for Zib Digital Australia. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Head of Sales hires in digital marketing.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recMv8OvQtDdEFHBc' 
       OR (LOWER(name) = LOWER('Rino Crescitelli') OR linkedin_url = 'https://www.linkedin.com/in/rino-crescitelli-03a07b72' )
);
-- Insert: Brad Granger (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recNCL1WMsEbaQdI5', 'Brad Granger', NULL, 'https://www.linkedin.com/in/brad-granger', 'Country Manager - Australia', 'Melbourne, Australia', 'new', 'High', '', NULL, 'Saw the new AI lead follow-up features. Love seeing the innovation at Podium.', 'We''re working with some great SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in customer communication platforms.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recNCL1WMsEbaQdI5' 
       OR (LOWER(name) = LOWER('Brad Granger') OR linkedin_url = 'https://www.linkedin.com/in/brad-granger' )
);
-- Insert: Gerald Tjan (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recNW2SUgeipGLsSF', 'Gerald Tjan', NULL, 'https://www.linkedin.com/in/ACwAABKA4e4BDxT_Xi4jjYGexGnFn0ib2ovde84', 'APAC Commercial Director', 'Singapore, Singapore', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the new Sydney data centre launch. That''s exciting!', 'We''re working with some excellent enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases like yours.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around enterprise AE hiring in Sydney, especially with all the growth happening at Braze right now.', '2025-09-20T06:22:47.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recNW2SUgeipGLsSF' 
       OR (LOWER(name) = LOWER('Gerald Tjan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABKA4e4BDxT_Xi4jjYGexGnFn0ib2ovde84' )
);
-- Insert: Peter Ferris (CONNECTED)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recNY4MLjdShmAMIp', 'Peter Ferris', NULL, 'https://www.linkedin.com/in/ACwAAAJ7u4gBy6mWFy5rAgFX6GJLhMEPIXuixsw', 'Vice President of Sales', 'Port Melbourne, Australia', 'connected', 'High', 'LinkedIn Job Posts', '2025-09-19T05:28:40.661Z', 'Saw the rebrand news. Love the new direction focusing on connection and growth.', 'We''re working with some strong SDR candidates in hospitality tech at the moment. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your team. How are you finding the hospitality tech market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in the sector.', '2025-09-17T14:22:37.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recNY4MLjdShmAMIp' 
       OR (LOWER(name) = LOWER('Peter Ferris') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAJ7u4gBy6mWFy5rAgFX6GJLhMEPIXuixsw' )
);
-- Insert: David  Chin (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recNcpMTL0A0xRAgA', 'David  Chin', NULL, 'https://www.linkedin.com/in/ACwAAAnQlYcBl3v4LPAPiCUNdaNC2KIKvsEfsTU', 'Regional Sales Manager', 'Singapore', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Love seeing the Australia expansion at WEKA!', 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.', 'I see you''re building out the sales team. How are you finding the talent market across the region? We''re noticing some interesting shifts in the landscape, particularly around SDR hires in the data platform space. The demand for strong sales talent has really picked up with all the AI and data infrastructure growth happening.', '2025-09-20T06:14:58.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recNcpMTL0A0xRAgA' 
       OR (LOWER(name) = LOWER('David  Chin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAnQlYcBl3v4LPAPiCUNdaNC2KIKvsEfsTU' )
);
-- Insert: Alex Riley (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recNfAfvnJkWTtrC7', 'Alex Riley', NULL, 'https://www.linkedin.com/in/ACwAABz4LW8Bu1YPv2BIVLONjd_to4EkALcP31A', 'Director - Enterprise', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the James Bell appointment. Love the APAC focus at MRI!', 'We''re working with some excellent Account Manager candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.', 'I see you''re building out your team in Melbourne. How are you finding the local talent market? We''re noticing some interesting shifts around Account Manager hires in proptech, especially with all the expansion happening in the region.', '2025-09-21T14:12:54.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recNfAfvnJkWTtrC7' 
       OR (LOWER(name) = LOWER('Alex Riley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABz4LW8Bu1YPv2BIVLONjd_to4EkALcP31A' )
);
-- Insert: Allie Mairs (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recNjRuHmVh7cOkgK', 'Allie Mairs', NULL, 'https://www.linkedin.com/in/allielue', 'Director of Sales Asia Pacific', 'Sydney, Australia', 'new', 'High', '', NULL, 'Saw the news about Mindbody and ClassPass unifying under Playlist. That''s exciting!', 'Hope you''re well! We''re working with some strong SMB sales candidates at the moment. Happy to chat if useful.', 'I see you''re hiring SMB Sales Specialists at Mindbody. How are you finding the market? We work with companies like HubSpot on similar outbound roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recNjRuHmVh7cOkgK' 
       OR (LOWER(name) = LOWER('Allie Mairs') OR linkedin_url = 'https://www.linkedin.com/in/allielue' )
);
-- Insert: Mark Allen (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recNnWbCqF8cpnBuU', 'Mark Allen', NULL, 'https://www.linkedin.com/in/ACwAAARg3V8BI7d2U6G3ojR7ZtHeNqqP5Ze8QbE', 'Senior Manager of Automation and Robotic Solutions', 'Greater Sydney Area, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the news about the PoC Centre launch at Western Sydney Uni. That''s exciting!', 'We''re working with some great Sales Engineers in automation lately. Companies like HubSpot and Docusign have found our approach helpful during growth phases.', 'I see you''re building out your team. How are you finding the automation talent market? We''re noticing some interesting shifts in the landscape, particularly around Sales Engineer hires in manufacturing tech.', '2025-09-17T14:37:29.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recNnWbCqF8cpnBuU' 
       OR (LOWER(name) = LOWER('Mark Allen') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAARg3V8BI7d2U6G3ojR7ZtHeNqqP5Ze8QbE' )
);
-- Insert: Phil Harris (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recNnXOA4P3EuFnc0', 'Phil Harris', NULL, 'https://www.linkedin.com/in/ACwAAAXpQHYBUIYfNu617DcAU5TXq2mxvytHwuA', 'Enterprise Account Executive - ANZ', 'Greater Sydney Area, Australia', 'new', 'Medium', '', NULL, 'Saw the SonarQube brand unification news. Smart move bringing everything together.', 'We''re working with some strong Enterprise AEs in the DevOps space at the moment. Companies like HubSpot and Docusign have found our approach helpful for these senior roles.', 'I see you''re building out your enterprise team. How are you finding the DevOps sales market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in security and developer tools.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recNnXOA4P3EuFnc0' 
       OR (LOWER(name) = LOWER('Phil Harris') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAXpQHYBUIYfNu617DcAU5TXq2mxvytHwuA' )
);
-- Insert: Ankesh Chopra (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recNoe6lJ921Rlps6', 'Ankesh Chopra', NULL, 'https://www.linkedin.com/in/ACwAAAOC7oIBWZPlI-RdNm0J5l4tuXDpSP_onlg', 'Vice President APAC', 'Greater Sydney Area, Australia', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-19T05:28:29.851Z', 'Saw ClickUp hit $300M ARR. That''s huge! Congrats on the milestone.', 'We''re working with some excellent SMB AEs at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases.', 'I see you''re building out your SMB team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in SaaS with your growth trajectory.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recNoe6lJ921Rlps6' 
       OR (LOWER(name) = LOWER('Ankesh Chopra') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOC7oIBWZPlI-RdNm0J5l4tuXDpSP_onlg' )
);
-- Insert: Chris Sharp (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recNtXAxPmHRYjLFS', 'Chris Sharp', NULL, 'https://www.linkedin.com/in/ACwAAABBDdkB_SkNbaG77cj2ezLqZu1WwFaMITk', 'Senior Vice President Business Development', 'Brisbane City, Queensland, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the new Brisbane head office launch. Exciting local expansion!', 'We''re working with some excellent BDR candidates in Brisbane at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around BDR hiring in Brisbane, particularly with the tech expansion happening there.', '2025-10-01T14:22:35.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recNtXAxPmHRYjLFS' 
       OR (LOWER(name) = LOWER('Chris Sharp') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABBDdkB_SkNbaG77cj2ezLqZu1WwFaMITk' )
);
-- Insert: Simon Hickson (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recO8qXHvo5GH4BFt', 'Simon Hickson', NULL, 'https://www.linkedin.com/in/ACwAAArmqP8B9CJzz3P71JPu1MHEwr_5zYzxSQM', 'Regional Sales Manager', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Melbourne PartnerTrust event. Great partner momentum!', 'We''re working with some excellent enterprise AEs who have strong public sector experience at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their government facing teams.', 'Hope you''re well Simon! I see you''re building out the public sector team. How are you finding the market with all the new compliance requirements? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise AE hires who understand government frameworks. The IRAP certification news must be opening up some great opportunities for you.', '2025-09-25T05:24:03.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recO8qXHvo5GH4BFt' 
       OR (LOWER(name) = LOWER('Simon Hickson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAArmqP8B9CJzz3P71JPu1MHEwr_5zYzxSQM' )
);
-- Insert: Andrew Browne (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recOSGz78aiZDoTFW', 'Andrew Browne', NULL, 'https://www.linkedin.com/in/ACwAACODrt0B9dHaBUVWT_wmasxZV1Z2dbJyWQA', 'Sales Manager, MSP', 'Sydney, New South Wales, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Congrats on the Sydney office opening at Australia Square Plaza!', 'We''re working with some excellent account management talent in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when expanding their local teams.', 'Hope you''re settling in well at the new Sydney office! How are you finding the local talent market as you build out the team there? We''re seeing some interesting shifts in the market, particularly around account management and sales hires in the data security space.', '2025-09-23T14:23:21.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recOSGz78aiZDoTFW' 
       OR (LOWER(name) = LOWER('Andrew Browne') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACODrt0B9dHaBUVWT_wmasxZV1Z2dbJyWQA' )
);
-- Insert: Francesca M. (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recOTy4d9oNCZOHiX', 'Francesca M.', NULL, 'https://www.linkedin.com/in/ACwAAAciFtYBNr4jws-GVg6DhS5yu9d2VSVxB1A', 'Regional Vice President', 'Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the $270M funding news. Congrats on the massive round!', 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in observability and SaaS.', '2025-09-17T14:24:52.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recOTy4d9oNCZOHiX' 
       OR (LOWER(name) = LOWER('Francesca M.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAciFtYBNr4jws-GVg6DhS5yu9d2VSVxB1A' )
);
-- Insert: Emlyn Gavin (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recOlDVQe1O0BVj0M', 'Emlyn Gavin', NULL, 'https://www.linkedin.com/in/ACwAABA0BdEBOjlnr8yUMmZNOJg8TUTfAhRYSFY', 'Head of Sales, ANZ', 'Sydney, Australia', 'new', 'High', '', NULL, 'Saw the Series D news. Congrats on the $150M funding!', 'We''re working with some strong SDR candidates in cybersecurity at the moment. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your SDR team. How are you finding the cybersecurity talent market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in GRC and compliance.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recOlDVQe1O0BVj0M' 
       OR (LOWER(name) = LOWER('Emlyn Gavin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABA0BdEBOjlnr8yUMmZNOJg8TUTfAhRYSFY' )
);
-- Insert: Richard Ford (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recOmQC6qHao1KlXw', 'Richard Ford', NULL, 'https://www.linkedin.com/in/ACwAAAC6F8ABJNTZy_TQ1GyavCFvWuLojnlx11I', 'Regional Sales Director APAC', 'Melbourne, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the news about Planful''s expansion into Germany and doubling the UK footprint. That''s exciting growth!', 'We''re working with some strong SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the SDR market? We''re noticing some interesting shifts in the talent landscape, particularly around sales development hires in SaaS.', '2025-09-17T14:23:43.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recOmQC6qHao1KlXw' 
       OR (LOWER(name) = LOWER('Richard Ford') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAC6F8ABJNTZy_TQ1GyavCFvWuLojnlx11I' )
);
-- Insert: Cameron McLean (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recPSWYRRbUh2sE83', 'Cameron McLean', NULL, 'https://www.linkedin.com/in/ACwAAEtunhoB-Tr9CmP6fxP5uhO7JhbN3-6uyfU', 'National Sales Manager', 'Noble Park, Victoria, Australia', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-26T02:16:29.673Z', 'Saw the ATS acquisition news. Exciting move for Melbourne operations!', 'We''re working with some excellent sales professionals in the industrial sector at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling teams after acquisitions.', 'Hope you''re settling in well post acquisition. How are you finding the talent market as you scale the sales team? We''re seeing some interesting shifts around industrial sales hires in Melbourne, particularly with companies expanding their local operations like Tyrolit.', '2025-09-25T05:21:44.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recPSWYRRbUh2sE83' 
       OR (LOWER(name) = LOWER('Cameron McLean') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAEtunhoB-Tr9CmP6fxP5uhO7JhbN3-6uyfU' )
);
-- Insert: Damien McDade (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recPVUmb6KS9d6FWg', 'Damien McDade', NULL, 'https://www.linkedin.com/in/damien-mcdade-83b485375', 'VP Revenue APAC', 'Melbourne, Australia', 'new', 'High', '', NULL, 'Saw the WorkSafe Guardian and Reactec acquisitions. Love seeing the EHS expansion!', 'We''re working with some great Account Managers in the safety and compliance space. Companies like HubSpot and Docusign have found our approach helpful during growth phases.', 'I see you''re building out your team. How are you finding the market with all the expansion happening? We''re noticing some interesting shifts in the talent landscape, particularly around Account Manager hires in the safety tech space.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recPVUmb6KS9d6FWg' 
       OR (LOWER(name) = LOWER('Damien McDade') OR linkedin_url = 'https://www.linkedin.com/in/damien-mcdade-83b485375' )
);
-- Insert: Stella Ramette (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recPbocNDRWzov5he', 'Stella Ramette', NULL, 'https://www.linkedin.com/in/ACwAAAXyqu0B0CJUPWCupyEprECOEG4C2ud5USg', 'Director Customer Relations & Sales, South East Asia', 'Singapore', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-21T23:33:04.777Z', 'Saw the Gartner Magic Quadrant recognition. Congrats on being named a Challenger!', 'We''re working with some excellent Sales Executives in the data space at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your sales team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Executive hires in data platforms and enterprise tech.', '2025-09-18T21:04:43.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recPbocNDRWzov5he' 
       OR (LOWER(name) = LOWER('Stella Ramette') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAXyqu0B0CJUPWCupyEprECOEG4C2ud5USg' )
);
-- Insert: Stefan Ellis (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recPdwewtvRIjIQ6T', 'Stefan Ellis', NULL, 'https://www.linkedin.com/in/ACwAAARdBWMBtDKClRUttSAPcjdVpyK3eJmwsLM', 'Senior Business Development Manager', 'Sydney, New South Wales, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Indue acquisition news. That''s exciting consolidation!', 'We''re working with some excellent BD candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your commercial team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the landscape, particularly around Business Development hires in fintech and payments.', '2025-09-29T14:22:58.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recPdwewtvRIjIQ6T' 
       OR (LOWER(name) = LOWER('Stefan Ellis') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAARdBWMBtDKClRUttSAPcjdVpyK3eJmwsLM' )
);
-- Insert: David Hickey (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recPhd3PZlByZmWIX', 'David Hickey', NULL, 'https://www.linkedin.com/in/ACwAAALXTBsBfgTRk7DI_wcShCZfWQpoIjE4BSs', 'Executive Director, ANZ', '', 'new', 'High', '', NULL, 'Saw the Mira AI launch at the Summit. That''s exciting stuff!', 'We''re working with some great BDR candidates at the moment. We helped HubSpot and Docusign with similar roles during their scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around BDR hires in media intelligence and SaaS.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recPhd3PZlByZmWIX' 
       OR (LOWER(name) = LOWER('David Hickey') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAALXTBsBfgTRk7DI_wcShCZfWQpoIjE4BSs' )
);
-- Insert: David Chapman (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recPjYT5TcmgJBgee', 'David Chapman', NULL, 'https://www.linkedin.com/in/ACwAAAzGmOYBnH-p0M8MaqRqn3Urbzfm9K2GcCg', 'Vice President of Business Development, APAC', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the GenieAI expansion plans. Great move for the Sydney office!', 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around SDR hiring in Sydney, particularly with all the GTM expansion happening at tech companies like Bigtincan.', '2025-09-28T04:07:37.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recPjYT5TcmgJBgee' 
       OR (LOWER(name) = LOWER('David Chapman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAzGmOYBnH-p0M8MaqRqn3Urbzfm9K2GcCg' )
);
-- Insert: Tiffany Ong (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recPkOCgzJsSnfl6I', 'Tiffany Ong', NULL, 'https://www.linkedin.com/in/ACwAAC-xkRUBefmpBmPEewE2wzIycV2STykoqvs', 'Head of Microsoft Singapore', 'Singapore, Singapore', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the AI governance platform launch. Love seeing Wild Tech innovating in that space.', 'We''re working with some strong BDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.', 'I see you''re building out your team. How are you finding the market for BDR talent? We''re noticing some interesting shifts in the landscape, particularly around enterprise-focused BDR hires in tech services.', '2025-09-18T21:06:12.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recPkOCgzJsSnfl6I' 
       OR (LOWER(name) = LOWER('Tiffany Ong') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAC-xkRUBefmpBmPEewE2wzIycV2STykoqvs' )
);
-- Insert: David Helleman (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recPkP3iUMobkwwc3', 'David Helleman', NULL, 'https://www.linkedin.com/in/ACwAAAKaCvgB327GG3yyjVQL2FeuWKM2unL9MW8', 'Regional Sales Manager', 'Pelican Waters, Queensland, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the Singapore EDB partnership. Smart APAC expansion move!', 'We''re working with some excellent Mid Market AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling across APAC markets.', 'I see you''re building out your Mid Market AE team. How are you finding the talent market across the region? We''re noticing some interesting shifts in the landscape, particularly around experienced AE hires in cybersecurity. The APAC expansion through Singapore is exciting timing with all the AI security demand we''re seeing.', '2025-09-28T04:11:18.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recPkP3iUMobkwwc3' 
       OR (LOWER(name) = LOWER('David Helleman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKaCvgB327GG3yyjVQL2FeuWKM2unL9MW8' )
);
-- Insert: Luke McCarthy (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recPqviwppD3bMyIv', 'Luke McCarthy', NULL, 'https://www.linkedin.com/in/ACwAAAJXC9MB_HN2OMXQxDFCk0u0SLG-_eghdUU', 'ANZ Director of Account Managers | Local Government and Housing | Civica APAC', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the news about Christopher Smith joining as APAC MD. That''s exciting for the expansion!', 'We''re working with some great AE candidates with local government experience at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the local government market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in the public sector space.', '2025-09-18T21:02:47.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recPqviwppD3bMyIv' 
       OR (LOWER(name) = LOWER('Luke McCarthy') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAJXC9MB_HN2OMXQxDFCk0u0SLG-_eghdUU' )
);
-- Insert: Jonathon McCauley (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recPrl9inZ1Glb0nJ', 'Jonathon McCauley', NULL, 'https://www.linkedin.com/in/ACwAABI7n6ABBU7ZtUaDgXXqKkZXyDL_2iHLqrI', 'Sales Director - Overseas Revenue & Channel', 'Sydney, Australia', 'new', 'High', '', NULL, 'Saw the news about the corporate restructure and new board appointments. Smart move to strengthen the team.', 'We''re working with some great SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.', 'I see you''re building out your sales team. How are you finding the HR tech talent market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in SaaS.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recPrl9inZ1Glb0nJ' 
       OR (LOWER(name) = LOWER('Jonathon McCauley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABI7n6ABBU7ZtUaDgXXqKkZXyDL_2iHLqrI' )
);
-- Insert: Theo McPeake (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recPsPgH8dtrMOvAH', 'Theo McPeake', NULL, 'https://www.linkedin.com/in/ACwAABDf5kABvuQIkoh3JBPi4Wsgj_VWMd9RiQk', 'Sales Director, ANZ', '', 'new', 'High', '', NULL, 'Saw the Mira AI launch at the Summit. That''s exciting stuff!', 'We''re working with some great BDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around BDR hires in media tech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recPsPgH8dtrMOvAH' 
       OR (LOWER(name) = LOWER('Theo McPeake') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABDf5kABvuQIkoh3JBPi4Wsgj_VWMd9RiQk' )
);
-- Insert: Martin Cerantonio (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recPw0cbrwdMvBOBI', 'Martin Cerantonio', NULL, 'https://www.linkedin.com/in/ACwAAACBWQ4BsBoCjhpihPpsaKPuJzXBf7u7opQ', 'Senior Manager, Channel Sales and Alliances for APJ', 'Melbourne, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the APAC expansion focus. 27% market growth is huge!', 'We''re working with some excellent strategic AE candidates at the moment who have deep enterprise software experience. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC teams.', 'I see you''re building out your strategic sales team across Sydney and Melbourne. How are you finding the talent market in the region? We''re noticing some interesting shifts around strategic AE hires, particularly with companies scaling their APAC operations. The containerization space is moving fast and finding the right enterprise sales talent who can navigate that complexity seems to be the challenge everyone''s talking about.', '2025-09-28T14:43:09.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recPw0cbrwdMvBOBI' 
       OR (LOWER(name) = LOWER('Martin Cerantonio') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACBWQ4BsBoCjhpihPpsaKPuJzXBf7u7opQ' )
);
-- Insert: Praba Krishnan (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recQRKv6RJFbENhnS', 'Praba Krishnan', NULL, 'https://www.linkedin.com/in/ACwAAADzZ_QBZgSFXXp38D2045XQcqQ9I56w1P0', 'Field Sales Director, Western Australia & Asia', 'Greater Perth Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love Info-Tech''s commitment to the Sydney market. Hope you''re well!', 'We''re working with some excellent account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.', 'I see you''re building out your account management team. How are you finding the talent market? We''re noticing some interesting shifts around senior account manager hires in the tech research space, particularly with companies scaling their ANZ presence.', '2025-09-25T05:15:22.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recQRKv6RJFbENhnS' 
       OR (LOWER(name) = LOWER('Praba Krishnan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADzZ_QBZgSFXXp38D2045XQcqQ9I56w1P0' )
);
-- Insert: Bhavik Vashi (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recQYhqcHLbmbazYf', 'Bhavik Vashi', NULL, 'https://www.linkedin.com/in/ACwAAAtjo3ABodnUAb0M_AJJ6dItjjbIYtUN5F8', 'Managing Director, Asia Pacific & Middle East', 'Singapore', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Sydney office launch news. Congrats on leading the expansion! That''s exciting to see Carta establishing local operations.', 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.', 'Hope you''re settling in well with the Sydney launch. How are you finding the local talent market as you build out the team? We''re seeing some interesting shifts in the market, particularly around sales development hires in fintech.', '2025-09-20T02:47:40.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recQYhqcHLbmbazYf' 
       OR (LOWER(name) = LOWER('Bhavik Vashi') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAtjo3ABodnUAb0M_AJJ6dItjjbIYtUN5F8' )
);
-- Insert: Colin Stapleton (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recQfOI4QymR3rqyj', 'Colin Stapleton', NULL, 'https://www.linkedin.com/in/ACwAAAARUC0BN-Z3aOd0BYZfffvwRNg2tZvutUg', 'Regional Sales Manager', 'Greater Sydney Area', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-29T01:06:48.672Z', 'Love the MiClub win. Half of Australia''s golf clubs is quite the achievement!', 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams in this market.', 'I see you''re building out your enterprise sales team. How are you finding the talent market? We''re noticing some interesting shifts in the landscape, particularly around senior AE hires in the cloud infrastructure space. With all the growth happening in APAC, it''s becoming quite competitive for top enterprise sales talent.', '2025-09-28T14:38:01.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recQfOI4QymR3rqyj' 
       OR (LOWER(name) = LOWER('Colin Stapleton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAARUC0BN-Z3aOd0BYZfffvwRNg2tZvutUg' )
);
-- Insert: Aleks Kakasiouris (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recQlFBEc6g3VQTla', 'Aleks Kakasiouris', NULL, 'https://www.linkedin.com/in/ACwAAAc7ZUcB_rICSouYWKqvrDgMAWRJyK6nc60', 'Manager - Sales Development, Australia & New Zealand', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Stripe Tour Sydney event. That''s exciting growth!', 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales development teams.', 'I see you''re building out your SDR team. How are you finding the local talent market? We''re noticing some interesting shifts around sales development hires in Sydney, particularly with the growth you''re seeing at Stripe. Over a million users in AU/NZ is impressive momentum.', '2025-09-28T04:02:06.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recQlFBEc6g3VQTla' 
       OR (LOWER(name) = LOWER('Aleks Kakasiouris') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAc7ZUcB_rICSouYWKqvrDgMAWRJyK6nc60' )
);
-- Insert: Stanley Chia (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recQslYokcb6MkvuM', 'Stanley Chia', NULL, 'https://www.linkedin.com/in/stanleychia', 'Sales Director', 'Melbourne, Australia', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), 'Saw the news about Hyland''s rebrand in March. Love the AI automation pivot!', 'We''re working with some excellent AE candidates in the automation space at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.', 'I see you''re building out your team. How are you finding the APAC market for new business development? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in enterprise automation and AI.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recQslYokcb6MkvuM' 
       OR (LOWER(name) = LOWER('Stanley Chia') OR linkedin_url = 'https://www.linkedin.com/in/stanleychia' )
);
-- Insert: Basil Botoulas (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recR17tEl7dE1entP', 'Basil Botoulas', NULL, 'https://www.linkedin.com/in/ACwAAABfbCsBoW2Bzka0GyR4nxYRSkPCzvyhI1g', 'Senior Vice President of Sales, APJI', 'Greater Sydney Area', 'in queue', 'High', 'LinkedIn Job Posts', '2025-09-21T23:26:32.522Z', 'Love the international expansion focus at Sprinklr!', 'We''re working with some excellent enterprise SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during international scaling phases.', 'I see you''re building out your enterprise SDR team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around senior SDR hires in the CX space.', '2025-09-20T14:22:21.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recR17tEl7dE1entP' 
       OR (LOWER(name) = LOWER('Basil Botoulas') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABfbCsBoW2Bzka0GyR4nxYRSkPCzvyhI1g' )
);
-- Insert: Alex Nemeth (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recR2tbiEKWJq3dd0', 'Alex Nemeth', NULL, 'https://www.linkedin.com/in/ACwAAAKzBZIB8mfThsIR4XMC6xBnC_Zf2o3Ka5E', 'Country Manager, Australia & NZ', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the X4 Sydney Summit news. Love seeing the new AI tech launch.', 'We''re working with some great Partner Sales Managers at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.', 'I see you''re building out your partner team. How are you finding the partner sales market? We''re noticing some interesting shifts in the talent landscape, particularly around Partner Sales Manager hires in SaaS.', '2025-09-18T21:00:47.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recR2tbiEKWJq3dd0' 
       OR (LOWER(name) = LOWER('Alex Nemeth') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKzBZIB8mfThsIR4XMC6xBnC_Zf2o3Ka5E' )
);
-- Insert: Paul Mitchinson (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recR6BDFkX725gzwN', 'Paul Mitchinson', NULL, 'https://www.linkedin.com/in/paul-mitchinson-8a4a06129', 'Director Growth & Partnerships APJ', 'Sydney, Australia', 'new', 'High', '', NULL, 'Great to connect Paul! Love seeing growth and partnerships leaders driving expansion across the APAC region.', 'We''re working with some excellent Sales Director candidates across enterprise software.', 'I see you''re building out your team for Think & Grow. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in enterprise software.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recR6BDFkX725gzwN' 
       OR (LOWER(name) = LOWER('Paul Mitchinson') OR linkedin_url = 'https://www.linkedin.com/in/paul-mitchinson-8a4a06129' )
);
-- Insert: Jason Ogg (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recR8iqLtEZVjlc1V', 'Jason Ogg', NULL, 'https://www.linkedin.com/in/ACwAAAuayowBpHsQMxgUNYX7bw3e4UZbpfhq_DE', 'Enterprise Sales Manager', 'Perth, Western Australia, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Weir acquisition news. That''s huge for Perth!', 'We''re working with some excellent enterprise sales candidates in Perth at the moment. Companies like HubSpot and Docusign have found our approach helpful during major growth phases like this.', 'Hope you''re well Jason! I see you''re building out the enterprise sales team. How are you finding the local talent market with all the growth happening? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales hires in mining tech. The acquisition must be creating some exciting opportunities for the team.', '2025-09-28T04:05:27.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recR8iqLtEZVjlc1V' 
       OR (LOWER(name) = LOWER('Jason Ogg') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAuayowBpHsQMxgUNYX7bw3e4UZbpfhq_DE' )
);
-- Insert: Vinod Venugopal (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recR9WC8sutfWbi4o', 'Vinod Venugopal', NULL, 'https://www.linkedin.com/in/vinod-venugopal-72038512', 'Senior Regional Sales Director', 'Melbourne, Australia', 'new', 'High', '', NULL, 'Congrats on HCLTech being recognised as Dell Technologies'' 2025 Global Alliances AI Partner of the Year! That''s fantastic news.', 'We''re working with some excellent Sales Director candidates across enterprise software if you''re looking externally.', 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in enterprise software.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recR9WC8sutfWbi4o' 
       OR (LOWER(name) = LOWER('Vinod Venugopal') OR linkedin_url = 'https://www.linkedin.com/in/vinod-venugopal-72038512' )
);
-- Insert: Bridie Rees (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recRBJExkjmk8tQxi', 'Bridie Rees', NULL, 'https://www.linkedin.com/in/bridierees', 'Senior People Business Partner, APJ', 'Sydney, Australia', 'new', 'High', '', NULL, 'Saw the news about your CRM hitting $100M run rate. That''s exciting!', 'Hope you''re well! We''re working with some strong SDR Manager candidates at the moment. Happy to chat if useful.', 'I see you''re hiring an SDR Manager at monday.com. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recRBJExkjmk8tQxi' 
       OR (LOWER(name) = LOWER('Bridie Rees') OR linkedin_url = 'https://www.linkedin.com/in/bridierees' )
);
-- Insert: Thomas Nguyen (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recRHOa9593vDsWWv', 'Thomas Nguyen', NULL, 'https://www.linkedin.com/in/ACwAAF5SEpABBgPXE1tn0kxcv8PV2qx3AQlcVYw', 'Sales director', 'Redfern, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Congrats on the KuppingerCole leadership recognition!', 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent market, particularly around enterprise sales hires in identity management. The demand for experienced AEs who understand complex security solutions has really picked up lately.', '2025-09-23T14:27:00.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recRHOa9593vDsWWv' 
       OR (LOWER(name) = LOWER('Thomas Nguyen') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAF5SEpABBgPXE1tn0kxcv8PV2qx3AQlcVYw' )
);
-- Insert: John Delbridge (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recRT8mNUIo7USXXR', 'John Delbridge', NULL, 'https://www.linkedin.com/in/ACwAAAN4B1YB344JnhZ5c9G2WE4lYLzX6ILcAPM', 'National Sales Manager - Adaptalift Access Rentals', 'Greater Brisbane Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the new electric forklift launch. Love the sustainability focus!', 'We''re working with some excellent account management candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.', 'I see you''re building out your sales team at Adaptalift. How are you finding the Melbourne talent market? We''re noticing some interesting shifts in the market, particularly around account management hires in the materials handling space. The focus on sustainability and safety tech seems to be driving some great conversations with candidates.', '2025-09-25T05:19:37.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recRT8mNUIo7USXXR' 
       OR (LOWER(name) = LOWER('John Delbridge') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAN4B1YB344JnhZ5c9G2WE4lYLzX6ILcAPM' )
);
-- Insert: Ron Gounder (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recRYwkvxIXzER0at', 'Ron Gounder', NULL, 'https://www.linkedin.com/in/ACwAAAL66VMBzz4J9xphbUqG-QZzdiaYFvihk08', 'Chief Customer Officer', 'Sydney, New South Wales, Australia', 'new', 'High', '', NULL, 'Saw the news about your New Zealand expansion with Endeavour and Thyme Technology. Great move into the Kiwi market!', 'We''re working with some excellent Partner Sales Managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their partner functions.', 'I see you''re building out your partner sales team. How are you finding the market for partner-focused roles? We''re noticing some interesting shifts in the talent landscape, particularly around Partner Sales Manager hires in the ERP space.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recRYwkvxIXzER0at' 
       OR (LOWER(name) = LOWER('Ron Gounder') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAL66VMBzz4J9xphbUqG-QZzdiaYFvihk08' )
);
-- Insert: Adam Duncan (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recRmKP141sKW0u3W', 'Adam Duncan', NULL, 'https://www.linkedin.com/in/ACwAABIRrgMBeRq8C32gXuza-3DnpydClkc6kgI', 'General Manager of Sales', 'Melbourne, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the ongoing Melbourne recruitment drive. Hope it''s going well!', 'We''re working with some excellent sales professionals in the Melbourne market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their commercial teams.', 'I see you''re building out your sales team at Adaptalift. How are you finding the local talent market in Melbourne? We''re noticing some interesting shifts in the talent landscape, particularly around sales and account management hires in the materials handling space.', '2025-09-25T05:19:37.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recRmKP141sKW0u3W' 
       OR (LOWER(name) = LOWER('Adam Duncan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABIRrgMBeRq8C32gXuza-3DnpydClkc6kgI' )
);
-- Insert: Gary Zeng (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recRygiNX8MCT1Ldz', 'Gary Zeng', NULL, 'https://www.linkedin.com/in/ACwAAAvsStkBrpcODglXSqC1jpHE7Z_QsvKCNHo', 'Sr. Manager, Channel Sales | Partnerships, Alliances and Channel - APAC ', 'Sydney, New South Wales, Australia', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-30T05:18:03.143Z', 'Love what Vimeo''s doing in the enterprise video space.', 'We''re working with some excellent senior AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.', 'I see you''re building out your team. How are you finding the market for senior AE talent? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales hires in the video tech space.', '2025-09-29T14:15:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recRygiNX8MCT1Ldz' 
       OR (LOWER(name) = LOWER('Gary Zeng') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAvsStkBrpcODglXSqC1jpHE7Z_QsvKCNHo' )
);
-- Insert: Aidan McDonald (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recSAqqPakctWG82e', 'Aidan McDonald', NULL, 'https://www.linkedin.com/in/ACwAAAtP-LQB2y4WMsUQ6IY4j4uY3issCqvL2QA', 'VP Sales, APAC', 'Singapore, Singapore', 'new', 'High', '', NULL, 'Saw the $152.5M funding news. Congrats on the round!', 'We''re working with some excellent Enterprise Sales Executives in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the enterprise sales market in fintech? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise Sales Executive hires in treasury and payments.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recSAqqPakctWG82e' 
       OR (LOWER(name) = LOWER('Aidan McDonald') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAtP-LQB2y4WMsUQ6IY4j4uY3issCqvL2QA' )
);
-- Insert: Tim McDonnell - SVP Sales (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recSNJnFxhTz2BH5F', 'Tim McDonnell - SVP Sales', NULL, 'https://www.linkedin.com/in/ACwAAAG4k7wBi1m1-umvMJccP4o3Zl4sFOO21aM', 'SVP Sales AU/NZ', 'Australia', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-21T23:24:34.591Z', 'Saw the Reece partnership news. That''s a massive win for the ANZ team!', 'We''re working with some excellent Account Manager candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in competitive markets.', 'Hope you''re well Tim! I see you''re building out your team. How are you finding the local talent market after that big Reece win? We''re noticing some interesting shifts in the talent market, particularly around Account Manager hires in payments. The demand for experienced AMs who understand unified commerce is really heating up. Would love to chat about what we''re seeing if you''re open to it.', '2025-09-21T14:17:50.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recSNJnFxhTz2BH5F' 
       OR (LOWER(name) = LOWER('Tim McDonnell - SVP Sales') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAG4k7wBi1m1-umvMJccP4o3Zl4sFOO21aM' )
);
-- Insert: James Hayward (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recSeScFrr9sO0qqy', 'James Hayward', NULL, 'https://www.linkedin.com/in/ACwAAAFVz2oBlYf7WzWxpqZ8nxrAaXjzFfo-OzU', 'Regional Sales Director, ANZ', 'Greater Sydney Area, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the $270M funding news. Congrats on the round!', 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in observability and SaaS.', '2025-09-17T14:24:52.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recSeScFrr9sO0qqy' 
       OR (LOWER(name) = LOWER('James Hayward') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFVz2oBlYf7WzWxpqZ8nxrAaXjzFfo-OzU' )
);
-- Insert: Blair Hasforth (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recSeWS3cXVkz7Jjp', 'Blair Hasforth', NULL, 'https://www.linkedin.com/in/ACwAAADWE7oB1FD64dzt9CaP8Mgmkzw2Yt1FjvQ', 'Sales Director - APJ', 'Greater Melbourne Area', 'messaged', 'High', 'LinkedIn Job Posts', '2025-09-23T06:54:07.282Z', 'Saw the Melbourne office expansion. Exciting growth in ANZ!', 'We''re working with some excellent AE candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.', 'I see you''re building out your team in Melbourne. How are you finding the local talent market since the office expansion? We''re noticing some interesting shifts in the market, particularly around Account Executive hires in the privacy and compliance space.', '2025-09-22T14:27:18.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recSeWS3cXVkz7Jjp' 
       OR (LOWER(name) = LOWER('Blair Hasforth') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADWE7oB1FD64dzt9CaP8Mgmkzw2Yt1FjvQ' )
);
-- Insert: Charlie Pennington (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recSprmCXhYxtzBqN', 'Charlie Pennington', NULL, 'https://www.linkedin.com/in/ACwAAAZfnxoBbtSFoNGub--1Onpu97IEnac1TF8', 'Head of Sales & GTM | Cap Tables & PE | APAC & MENA', 'Singapore', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Sydney office launch news. That''s exciting to see Carta establishing a local presence here!', 'We''re working with some excellent SDR talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.', 'Hope you''re settling in well at Carta! How are you finding the local talent market as you build out the Sydney team? We''re seeing some interesting shifts around SDR hiring in the fintech space, particularly with companies establishing their first local operations.', '2025-09-20T02:47:41.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recSprmCXhYxtzBqN' 
       OR (LOWER(name) = LOWER('Charlie Pennington') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAZfnxoBbtSFoNGub--1Onpu97IEnac1TF8' )
);
-- Insert: Richard Exley (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recSq4OnWz9d1o4J8', 'Richard Exley', NULL, 'https://www.linkedin.com/in/ACwAAAkYxXMB1Zhtw85yzw5Dk-3D0NxL9MuEgyk', 'Vice President', 'Sydney, New South Wales, Australia', 'in queue', 'High', 'LinkedIn Job Posts', '2025-09-21T23:23:57.507Z', 'Saw the Anacle acquisition news. Great APAC expansion!', 'We''re working with some excellent Account Manager candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.', 'I see you''re building out your sales team in Melbourne. How are you finding the local talent market? We''re noticing some interesting shifts around Account Manager hires in proptech, especially with all the expansion happening in the space.', '2025-09-21T14:12:54.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recSq4OnWz9d1o4J8' 
       OR (LOWER(name) = LOWER('Richard Exley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAkYxXMB1Zhtw85yzw5Dk-3D0NxL9MuEgyk' )
);
-- Insert: Kyle Baker (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recT0VOYPWVuGqUw5', 'Kyle Baker', NULL, 'https://www.linkedin.com/in/kyle-thomas-baker', 'Supplier Sales Manager', 'Greensborough, Australia', 'new', 'High', '', NULL, 'Great to connect Kyle! Love seeing the growth at E1 across the APAC region.', 'We''re working with some excellent AE candidates across enterprise software.', 'I see you''re building out your team for E1. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recT0VOYPWVuGqUw5' 
       OR (LOWER(name) = LOWER('Kyle Baker') OR linkedin_url = 'https://www.linkedin.com/in/kyle-thomas-baker' )
);
-- Insert: Abhishek Nigam (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recTEZZD0NEh89ZJz', 'Abhishek Nigam', NULL, 'https://www.linkedin.com/in/ACwAAAIfh94BHkk8hLf3tbr6NUYHp0kXiYJk53E', 'Country Sales Manager', 'Singapore', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the ANZ expansion plans. Exciting growth ahead!', 'We''re working with some excellent Account Executive candidates at the moment, particularly those with enterprise data experience. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams during growth phases.', 'I see you''re building out your team in Sydney. How are you finding the talent market with all the expansion happening? We''re noticing some interesting shifts in the landscape, particularly around Account Executive hires in the data transformation space. Would love to share what we''re seeing and hear your thoughts on the local market dynamics.', '2025-09-22T14:18:39.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recTEZZD0NEh89ZJz' 
       OR (LOWER(name) = LOWER('Abhishek Nigam') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAIfh94BHkk8hLf3tbr6NUYHp0kXiYJk53E' )
);
-- Insert: Melissa Kiew (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recTEaeGQAQdFajEx', 'Melissa Kiew', NULL, 'https://www.linkedin.com/in/melissakiew', 'Strategic Sales Manager - SG, MY, PH', 'Singapore, Singapore', 'new', 'High', '', NULL, 'Congrats on the TikTok Shop launch! That''s been such an exciting development to watch.', 'We''re working with some excellent BDM candidates across tech.', 'I see you''re building out your team for TikTok. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around BDM hires in tech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recTEaeGQAQdFajEx' 
       OR (LOWER(name) = LOWER('Melissa Kiew') OR linkedin_url = 'https://www.linkedin.com/in/melissakiew' )
);
-- Insert: Mark Gosney (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recTKXlOXwImV7ZnV', 'Mark Gosney', NULL, 'https://www.linkedin.com/in/ACwAACNIHEYBcuR9nj0mOxmHSGEOu2hCK6084W0', 'Sales Director, Australia & New Zealand', 'Sydney, Australia', 'new', 'High', '', NULL, 'Saw the AXIUM CX9000 launch. Love seeing the innovation in payments tech.', 'We''re working with some strong Account Directors in payments at the moment. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your team. How are you finding the payments talent market? We''re noticing some interesting shifts in the landscape, particularly around Account Director hires in fintech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recTKXlOXwImV7ZnV' 
       OR (LOWER(name) = LOWER('Mark Gosney') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACNIHEYBcuR9nj0mOxmHSGEOu2hCK6084W0' )
);
-- Insert: Kenneth Yeo (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recTMuCDsidOkGJj7', 'Kenneth Yeo', NULL, 'https://www.linkedin.com/in/kennethyeoideas', 'Team Lead - APAC', 'Sydney, Australia', 'new', 'Medium', '', NULL, 'Congrats on the five HotelTechAwards wins! That''s fantastic recognition for the team.', 'We''re working with some excellent Sales Director candidates across SaaS if you''re looking externally.', 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in SaaS.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recTMuCDsidOkGJj7' 
       OR (LOWER(name) = LOWER('Kenneth Yeo') OR linkedin_url = 'https://www.linkedin.com/in/kennethyeoideas' )
);
-- Insert: Kylie Terrell (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recTXESaNl5pQJaHv', 'Kylie Terrell', NULL, 'https://www.linkedin.com/in/ACwAAAYnjxUByubGwx8my9yZnyg_OBR5ridC98Y', 'Sales Director', 'Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love seeing Reward Gateway''s Sydney office growth as the Australian HQ!', 'We''re working with some excellent Account Executive candidates in the employee engagement space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.', 'I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in employee engagement. The demand for experienced AEs who understand the local market dynamics has been really strong lately.', '2025-09-28T14:25:25.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recTXESaNl5pQJaHv' 
       OR (LOWER(name) = LOWER('Kylie Terrell') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAYnjxUByubGwx8my9yZnyg_OBR5ridC98Y' )
);
-- Insert: Eunice Zhou (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recTaixdewDw9YJcT', 'Eunice Zhou', NULL, 'https://www.linkedin.com/in/ACwAAArP78ABdnTtt4D89VKQKU1y4O_S5Z6eLk4', 'Regional Sales Manager', 'Singapore', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Love the Australia hiring push at WEKA. Exciting growth phase!', 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases in Australia.', 'Hope you''re settling in well at WEKA! I see you''re building out the sales team across Australia. How are you finding the talent market for SDR hires? We''re noticing some interesting shifts in the market, particularly around enterprise sales development roles in the data platform space.', '2025-09-20T06:14:58.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recTaixdewDw9YJcT' 
       OR (LOWER(name) = LOWER('Eunice Zhou') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAArP78ABdnTtt4D89VKQKU1y4O_S5Z6eLk4' )
);
-- Insert: Rj Price (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recTrlBWIIblCqFqv', 'Rj Price', NULL, 'https://www.linkedin.com/in/ACwAAAEZNsoBONZoaTMWdtCIGAEfsz3vZZkfH3M', 'Director, Field Sales', 'Greater Melbourne Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the inaugural Protect Tour in Sydney. That looked like a great event!', 'We''re working with some excellent BDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams in the region.', 'I see you''re building out your BDR team across APAC. How are you finding the local talent market in Sydney? We''re noticing some interesting shifts in the market, particularly around business development hires in cybersecurity. The partner expansion you''ve been doing locally seems to be creating some good momentum.', '2025-09-23T14:35:45.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recTrlBWIIblCqFqv' 
       OR (LOWER(name) = LOWER('Rj Price') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEZNsoBONZoaTMWdtCIGAEfsz3vZZkfH3M' )
);
-- Insert: Sean Walsh (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recTt5zewH8rolff3', 'Sean Walsh', NULL, 'https://www.linkedin.com/in/ACwAAAAYS8YBMkbqMtS4ixw10qimlev-rNnsb7c', 'Regional Director', 'Greater Melbourne Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the partner bootcamps in Sydney. Great local investment!', 'We''re working with some excellent AE candidates in the cybersecurity space at the moment. Companies like HubSpot and Docusign have found our approach helpful during their local expansion phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in Sydney''s identity security space.', '2025-09-23T14:16:09.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recTt5zewH8rolff3' 
       OR (LOWER(name) = LOWER('Sean Walsh') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAYS8YBMkbqMtS4ixw10qimlev-rNnsb7c' )
);
-- Insert: Jo Gaines (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recTxhXKXdBYpbxuw', 'Jo Gaines', NULL, 'https://www.linkedin.com/in/ACwAAABJiAUBly92h53-BiBUxcXFJMoMSvNa15Y', 'Head of Channel APJ', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Work Innovation Summit in Sydney. That''s exciting stuff!', 'We''re working with some excellent BDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.', 'I see you''re building out your BDR team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent space, particularly around sales development hires in the work management space. The demand for quality BDRs has really picked up since companies are focusing more on pipeline generation.', '2025-09-28T03:53:29.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recTxhXKXdBYpbxuw' 
       OR (LOWER(name) = LOWER('Jo Gaines') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABJiAUBly92h53-BiBUxcXFJMoMSvNa15Y' )
);
-- Insert: Houman Sahraei (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recU1KSmEEknWSDX1', 'Houman Sahraei', NULL, 'https://www.linkedin.com/in/ACwAAAVJz1cBS6pbRJJ9c3IOCA0lKSZ5e3AFEZI', 'Regional Partner Manager', 'Greater Sydney Area, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the $50M funding news. Congrats on the Series C!', 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in SaaS data protection.', '2025-09-17T14:28:47.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recU1KSmEEknWSDX1' 
       OR (LOWER(name) = LOWER('Houman Sahraei') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAVJz1cBS6pbRJJ9c3IOCA0lKSZ5e3AFEZI' )
);
-- Insert: Nicole Russo (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recU5tQ3owKu5VZgN', 'Nicole Russo', NULL, 'https://www.linkedin.com/in/ACwAAAEX0ygB1kHkM8_FGZdQLzx3fvf8OPgOQt8', 'VP Commercial Operations', 'Greater Adelaide Area, Australia', 'new', 'High', '', NULL, 'Saw the news about the SpaceX satellite launch and the $32M funding round. That''s exciting growth for Myriota!', 'We''re working with some strong SDR candidates in the tech space at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid growth phases.', 'I see you''re building out your sales team. How are you finding the market for SDR talent in IoT? We''re seeing some interesting shifts in the tech space, particularly around Sales Development Associate hires as companies scale internationally.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recU5tQ3owKu5VZgN' 
       OR (LOWER(name) = LOWER('Nicole Russo') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEX0ygB1kHkM8_FGZdQLzx3fvf8OPgOQt8' )
);
-- Insert: Marc AIRO-FARULLA (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recU9C98pNnTG3he0', 'Marc AIRO-FARULLA', NULL, 'https://www.linkedin.com/in/ACwAAARD2gcBeM9MU-k8mh27GWW8OGtwa37QKYE', 'APAC Sales Vice President - Digital Security Solutions', 'Greater Melbourne Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Onfido acquisition news. Great move for the APAC expansion!', 'We''re working with some excellent government sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.', 'I see you''re building out your government sales team. How are you finding the talent market across the region? We''re noticing some interesting shifts in the landscape, particularly around senior sales hires in cybersecurity.', '2025-09-20T06:41:38.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recU9C98pNnTG3he0' 
       OR (LOWER(name) = LOWER('Marc AIRO-FARULLA') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAARD2gcBeM9MU-k8mh27GWW8OGtwa37QKYE' )
);
-- Insert: Darren Bowie (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recU9epPzC3BPCyFL', 'Darren Bowie', NULL, 'https://www.linkedin.com/in/ACwAAB54KokB8IDOPpN99aoyKTufZ4xqMVWTYmU', 'Senior Business Development Manager', 'Brisbane, Queensland, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw RIB''s work on the Sydney Metro project. Impressive local impact!', 'We''re working with some excellent sales leaders in the construction tech space at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out their APAC teams.', 'I see you''re looking at the Sales Director role. How are you finding the local talent market? We''re noticing some interesting shifts in the sales hiring space, particularly around senior APAC roles in construction tech. The demand for leaders who understand both the technical side and the regional market dynamics has really picked up.', '2025-09-28T03:51:30.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recU9epPzC3BPCyFL' 
       OR (LOWER(name) = LOWER('Darren Bowie') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAB54KokB8IDOPpN99aoyKTufZ4xqMVWTYmU' )
);
-- Insert: Terence T. (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recUBQeie6NqioUwY', 'Terence T.', NULL, 'https://www.linkedin.com/in/ACwAABKiCb4BprKIrAdvTq6hryWeYhz0_o3zUGA', 'Enterprise Sales Lead - APAC', 'Singapore', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the ESET Connect 2025 workshops. Love the partner enablement focus!', 'We''re working with some excellent channel sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their partner teams.', 'Hope you''re well Terence! I see you''re building out the channel team. How are you finding the partner sales talent market? We''re noticing some interesting shifts in the talent space, particularly around channel sales hires in cybersecurity. The partner enablement work you''re doing sounds exciting.', '2025-09-22T14:17:19.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recUBQeie6NqioUwY' 
       OR (LOWER(name) = LOWER('Terence T.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABKiCb4BprKIrAdvTq6hryWeYhz0_o3zUGA' )
);
-- Insert: Jeff Yeoh (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recULu6090SCPVCup', 'Jeff Yeoh', NULL, 'https://www.linkedin.com/in/ACwAAAOu-CYBdGLDEgENcsaRq0r0DtK-jN_B40g', 'Director, Sales Development Asia Pacific & Japan', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Sydney office expansion at Australia Square. That''s exciting!', 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in cybersecurity. With Darktrace doubling headcount across Sydney, Melbourne, and Perth, you must be seeing some unique challenges in scaling the sales team.', '2025-09-22T14:21:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recULu6090SCPVCup' 
       OR (LOWER(name) = LOWER('Jeff Yeoh') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOu-CYBdGLDEgENcsaRq0r0DtK-jN_B40g' )
);
-- Insert: Gary Saw (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recUgjRpSWe3LJxdi', 'Gary Saw', NULL, 'https://www.linkedin.com/in/ACwAAAJNVu8BJVwDvyZiFcbEFviME0Jd_G_niVA', 'Vice President, APAC', 'Singapore', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-30T05:18:37.477Z', 'Saw the Shadow AI Report. Great insights on local AI governance risks!', 'We''re working with some excellent AE candidates in the SaaS security space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams during growth phases.', 'I see you''re building out your team. How are you finding the talent market in Sydney? We''re noticing some interesting shifts around Account Executive hires in the SaaS security space, especially with all the AI governance conversations happening locally.', '2025-09-29T14:24:49.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recUgjRpSWe3LJxdi' 
       OR (LOWER(name) = LOWER('Gary Saw') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAJNVu8BJVwDvyZiFcbEFviME0Jd_G_niVA' )
);
-- Insert: Kevin Rawlings (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recUn204rEUlRJCuV', 'Kevin Rawlings', NULL, 'https://www.linkedin.com/in/ACwAABpiT_cB0dsrxE6ZJKaVjoF_u7710jm2v7o', 'Chief Revenue Officer', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the $250M ARR milestone. That''s exciting growth!', 'We''re seeing some strong SDR talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their inbound teams.', 'I see you''re building out your SDR team. How are you finding the talent market in Sydney? We''re noticing some interesting shifts around inbound sales hires, particularly with all the growth happening in HR tech right now.', '2025-09-28T03:59:33.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recUn204rEUlRJCuV' 
       OR (LOWER(name) = LOWER('Kevin Rawlings') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABpiT_cB0dsrxE6ZJKaVjoF_u7710jm2v7o' )
);
-- Insert: John Aguilar (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recUoGB2snfBCFxsN', 'John Aguilar', NULL, 'https://www.linkedin.com/in/ACwAAAabEGwBUGUzwkySMSk0et_bdm33b9jvuAo', 'Enterprise Account Director', 'Sydney, New South Wales, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the LevelBlue acquisition news. Exciting expansion across APAC!', 'We''re working with some excellent Enterprise AE candidates in cybersecurity at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.', 'I see you''re building out your team. How are you finding the talent market across the region? We''re noticing some interesting shifts in the cybersecurity space, particularly around Enterprise AE hires with the consolidation happening in managed security services.', '2025-09-28T14:30:47.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recUoGB2snfBCFxsN' 
       OR (LOWER(name) = LOWER('John Aguilar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAabEGwBUGUzwkySMSk0et_bdm33b9jvuAo' )
);
-- Insert: Kris H. (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recUqx3fw3CSXDmI5', 'Kris H.', NULL, 'https://www.linkedin.com/in/ACwAAACf8LQBA2vs4yBy8Q-YopQav7uHzRVLsg0', 'Senior Vice President ANZ', 'Greater Melbourne Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the news about PROLIM''s expansion into ANZ through the Edge PLM acquisition. That''s exciting!', 'We''re working with some great inside sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.', 'I see you''re building out your inside sales team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around inside sales hires in manufacturing tech.', '2025-09-17T14:34:30.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recUqx3fw3CSXDmI5' 
       OR (LOWER(name) = LOWER('Kris H.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACf8LQBA2vs4yBy8Q-YopQav7uHzRVLsg0' )
);
-- Insert: Kayur Desai (KD) (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recV43UMRTfyNLHxs', 'Kayur Desai (KD)', NULL, 'https://www.linkedin.com/in/kayur-desai-kd', 'General Manager, Supplier', 'Sydney, Australia', 'new', 'Medium', '', NULL, 'Saw Ordermentum hit $2 billion in transactions. Incredible milestone! Congrats on the achievement.', 'Hope you''re well! We''re working with some strong Sales Enablement candidates at the moment. Happy to chat if useful.', 'I see Ordermentum is hiring a Sales Enablement Manager. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recV43UMRTfyNLHxs' 
       OR (LOWER(name) = LOWER('Kayur Desai (KD)') OR linkedin_url = 'https://www.linkedin.com/in/kayur-desai-kd' )
);
-- Insert: Olivia Willee (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recV5UeBE3v0UfAAx', 'Olivia Willee', NULL, 'https://www.linkedin.com/in/oliviawillee', 'Partner, Technology Consulting', 'Melbourne, Australia', 'new', 'Medium', '', NULL, 'Saw the news about KPMG''s $80M AI investment program. That''s exciting for tech consulting.', 'Hope you''re well! We''re working with some strong Salesforce leaders at the moment. Happy to chat if useful.', 'I see you''re hiring a Salesforce Director at KPMG. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recV5UeBE3v0UfAAx' 
       OR (LOWER(name) = LOWER('Olivia Willee') OR linkedin_url = 'https://www.linkedin.com/in/oliviawillee' )
);
-- Insert: Grant Eggleton (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recVVqQA04bA8foFo', 'Grant Eggleton', NULL, 'https://www.linkedin.com/in/grant-eggleton', 'SVP Operational Intelligence, R&D Technology', 'Melbourne, Australia', 'new', 'Medium', '', NULL, 'Love seeing the Nexus Black AI accelerator launch. Exciting stuff!', 'Hope you''re well! We''re working with some strong presales candidates in the AI space. Happy to chat if useful.', 'I see you''re hiring a Presales Consultant for AI Growth at IFS. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recVVqQA04bA8foFo' 
       OR (LOWER(name) = LOWER('Grant Eggleton') OR linkedin_url = 'https://www.linkedin.com/in/grant-eggleton' )
);
-- Insert: Darryn Cann (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recVXG8vZWpkDtJEL', 'Darryn Cann', NULL, 'https://www.linkedin.com/in/ACwAAAdtpg0BuA5bPVZzGUxzgFz1yg0lahczae8', 'CCS Solution Success Director - APAC', 'Greater Melbourne Area, Australia', 'new', 'Medium', '', NULL, 'Saw FICO Platform won the Business Intelligence Platform of the Year award. Congrats on the recognition!', 'We''re working with some experienced Key Account Managers at the moment. Companies like HubSpot and Docusign have found our approach helpful for similar roles.', 'I see you''re building out your Key Account Management team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around account management hires in fintech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recVXG8vZWpkDtJEL' 
       OR (LOWER(name) = LOWER('Darryn Cann') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAdtpg0BuA5bPVZzGUxzgFz1yg0lahczae8' )
);
-- Insert: Simon Dougall (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recVbIu3HXyxoTT4b', 'Simon Dougall', NULL, 'https://www.linkedin.com/in/simon-dougall-9a76022', 'Regional Sales Manager, APAC', 'Australia', 'new', 'Medium', '', NULL, 'Saw the mega deals news. Congrats on the strong Q2!', 'We''re working with some strong candidates in the TMT consulting space.', 'I see you''re hiring for the TMT Service Line Specialist role at Cognizant. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recVbIu3HXyxoTT4b' 
       OR (LOWER(name) = LOWER('Simon Dougall') OR linkedin_url = 'https://www.linkedin.com/in/simon-dougall-9a76022' )
);
-- Insert: Russell Palmer (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recVdMywHW3xi8QJC', 'Russell Palmer', NULL, 'https://www.linkedin.com/in/ACwAAACtfA0Bi_LljWCaTSXo3h9IOC1I6JjhOQ4', 'Managing Director', 'Greater Sydney Area, Australia', 'new', 'High', '', NULL, 'Saw the news about the UNSW TRaCE partnership. Love seeing the focus on clean energy tech.', 'We''re working with some excellent Business Development Managers in industrial automation at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the industrial automation market? We''re noticing some interesting shifts in the talent landscape, particularly around Business Development Manager hires in the automation space.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recVdMywHW3xi8QJC' 
       OR (LOWER(name) = LOWER('Russell Palmer') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACtfA0Bi_LljWCaTSXo3h9IOC1I6JjhOQ4' )
);
-- Insert: Rebecca Tissington (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recVeYbWO7aiqnyA4', 'Rebecca Tissington', NULL, 'https://www.linkedin.com/in/ACwAAA2DDFoBRAQ4FgVX8bmtNWBI51O2-HJkAwM', 'Head of Strategic Growth', 'Manly, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Indue acquisition news. That''s a big move for the payments space!', 'We''re working with some excellent business development candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.', 'I see you''re building out your business development team. How are you finding the Sydney talent market with all the growth happening at Cuscal? We''re noticing some interesting shifts in the talent landscape, particularly around BD hires in fintech, especially with companies going through major expansions like yours.', '2025-09-29T14:22:57.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recVeYbWO7aiqnyA4' 
       OR (LOWER(name) = LOWER('Rebecca Tissington') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA2DDFoBRAQ4FgVX8bmtNWBI51O2-HJkAwM' )
);
-- Insert: Marcel Pitt (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recVhkOS6mdaMmqwv', 'Marcel Pitt', NULL, 'https://www.linkedin.com/in/ACwAAABL5jkBcw2_leSGFicYww-jrL0zNHZ15yY', 'Enterprise Account Director', 'Melbourne, Victoria, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Tech Data partnership announcement. Great move for the ANZ market!', 'We''re working with some excellent enterprise AE candidates who have strong government experience at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out specialized teams.', 'Hope you''re well Marcel! I see you''re focused on the federal government space. How are you finding the market with all the AI adoption conversations happening? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise AE hires who understand the government sector. The regulatory requirements make it such a specialized area.', '2025-09-20T14:29:06.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recVhkOS6mdaMmqwv' 
       OR (LOWER(name) = LOWER('Marcel Pitt') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABL5jkBcw2_leSGFicYww-jrL0zNHZ15yY' )
);
-- Insert: Andrew Amos (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recVuTTPMjre0pdzP', 'Andrew Amos', NULL, 'https://www.linkedin.com/in/ACwAAAhmFyEBxNGGcz8NYgANX3_Zl7W176_MEzE', 'Regional Vice President, Sales', 'Sydney, New South Wales, Australia', 'in queue', 'High', 'LinkedIn Job Posts', '2025-09-21T23:31:12.208Z', 'Saw the Diligent Connections event coming to Sydney. That''s exciting!', 'We''re working with some excellent BDR and sales candidates in the GRC space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their business development teams.', 'Hope you''re well Andrew! I see you''re in the BDR role at Diligent. How are you finding the market for GRC solutions in Sydney? We''re noticing some interesting shifts in the talent space, particularly around business development hires in the compliance and governance sector. Would love to chat about what we''re seeing.', '2025-09-20T06:37:01.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recVuTTPMjre0pdzP' 
       OR (LOWER(name) = LOWER('Andrew Amos') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAhmFyEBxNGGcz8NYgANX3_Zl7W176_MEzE' )
);
-- Insert: Zeek Ahamed (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recW5EEcEPejLQr8U', 'Zeek Ahamed', NULL, 'https://www.linkedin.com/in/ACwAACbi_gMBw32I2uFNhXMH_4ry20bpfKnsFMw', 'Sales Director', 'Carlton, Victoria, Australia', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-21T23:25:53.231Z', 'Saw the Deputy Payroll launch from Sydney HQ. That''s exciting!', 'We''re seeing some strong account management talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.', 'Hope you''re well! I see Deputy''s expanding the platform with the new payroll launch. How are you finding the Sydney market as you scale into these new verticals? We''re noticing some interesting shifts in the talent market, particularly around account management hires in workforce tech.', '2025-09-20T14:15:39.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recW5EEcEPejLQr8U' 
       OR (LOWER(name) = LOWER('Zeek Ahamed') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACbi_gMBw32I2uFNhXMH_4ry20bpfKnsFMw' )
);
-- Insert: Justin Kumar (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recW8GWxVfjCXrLJz', 'Justin Kumar', NULL, 'https://www.linkedin.com/in/ACwAABcg8rYBv_-JsMsLfWAj1ey_38O-XFzMEro', 'Account Director - APAC', 'Greater Sydney Area, Australia', 'new', 'High', '', NULL, 'Saw the OnBoard AI launch. Love seeing the board governance space getting some innovation.', 'We''re working with some strong SDR candidates in the compliance space. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in governance tech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recW8GWxVfjCXrLJz' 
       OR (LOWER(name) = LOWER('Justin Kumar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABcg8rYBv_-JsMsLfWAj1ey_38O-XFzMEro' )
);
-- Insert: Matthias Hauser (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recWbkmCZPSbZLzcW', 'Matthias Hauser', NULL, 'https://www.linkedin.com/in/ACwAAAe4FegBoXgyPa40RNaX3DoVTnl68MrMcgI', 'Regional Sales Director APAC', 'New Port, South Australia, Australia', 'in queue', 'High', 'LinkedIn Job Posts', '2025-10-01T23:31:48.628Z', 'Saw the Melbourne office. Love the local presence!', 'We''re working with some excellent renewals and customer success candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their retention teams.', 'I see you''re building out your renewals team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around customer success and renewals hires in the analytics space. The demand for strong renewals managers has really picked up lately.', '2025-09-30T14:13:39.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recWbkmCZPSbZLzcW' 
       OR (LOWER(name) = LOWER('Matthias Hauser') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAe4FegBoXgyPa40RNaX3DoVTnl68MrMcgI' )
);
-- Insert: Mick Brennan (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recWrWT9sjmfy72Xr', 'Mick Brennan', NULL, 'https://www.linkedin.com/in/mick-brennan-5694b63a', 'Territory Manager NSW/ACT', 'Sydney, Australia', 'new', 'Medium', '', NULL, 'Saw the news about Jo Masters joining as MD at Baidam. Exciting times ahead!', 'Hope you''re well! We''re working with some strong Territory Manager candidates at the moment. Happy to chat if useful.', 'I see you''re expanding the Territory Manager team at Baidam. How''s it going with the new leadership? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recWrWT9sjmfy72Xr' 
       OR (LOWER(name) = LOWER('Mick Brennan') OR linkedin_url = 'https://www.linkedin.com/in/mick-brennan-5694b63a' )
);
-- Insert: Craig Moulin (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recWuuzxyqJ9dmUzs', 'Craig Moulin', NULL, 'https://www.linkedin.com/in/ACwAAA1k0soBc-cSa1UpfM6XE7mo7JV3v15so7k', 'General Manager', 'Melbourne, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love seeing Madison''s growth in the Sydney market!', 'We''re working with some excellent strategic account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around strategic account manager hires in the IT services space. The Sydney market has been pretty competitive lately.', '2025-09-25T05:13:10.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recWuuzxyqJ9dmUzs' 
       OR (LOWER(name) = LOWER('Craig Moulin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA1k0soBc-cSa1UpfM6XE7mo7JV3v15so7k' )
);
-- Insert: David Knapp (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recX6KaZhX8iULgTE', 'David Knapp', NULL, 'https://www.linkedin.com/in/ACwAAAe2JNkB2vv_Bt6sdOqHIkwnTBgZ_LFzb4U', 'Regional Sales Manager', 'Greater Brisbane Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the new Brisbane head office launch. That''s exciting!', 'We''re working with some excellent BDR candidates in Brisbane at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around BDR hires in the cloud space. The Brisbane market has been quite active lately.', '2025-10-01T14:22:34.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recX6KaZhX8iULgTE' 
       OR (LOWER(name) = LOWER('David Knapp') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAe2JNkB2vv_Bt6sdOqHIkwnTBgZ_LFzb4U' )
);
-- Insert: Craig Medlyn (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recX9UXlMexJJG5vn', 'Craig Medlyn', NULL, 'https://www.linkedin.com/in/ACwAAAciz48BT5_FJpB_thV1vmKo7APTHb6BQb0', 'Regional Director, APAC', 'Sydney, Australia', 'new', 'High', '', NULL, 'Saw the partnership news with ADS Solutions. Great move expanding into wholesale distribution.', 'We''re working with some strong Technical Presales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your team. How are you finding the technical presales market? We''re noticing some interesting shifts in the talent landscape, particularly around Technical Presales hires in data analytics.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recX9UXlMexJJG5vn' 
       OR (LOWER(name) = LOWER('Craig Medlyn') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAciz48BT5_FJpB_thV1vmKo7APTHb6BQb0' )
);
-- Insert: Ian Berkery (CONNECTED)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recXLlPst3eiT9anW', 'Ian Berkery', NULL, 'https://www.linkedin.com/in/ACwAAAHUvyUBu9nKhYs1XURqQZ5ev--qSBKMKDA', 'Regional Sales Director', 'Millers Point, New South Wales, Australia', 'connected', 'High', 'LinkedIn Job Posts', '2025-09-21T23:26:20.631Z', 'Saw OPSWAT at the Sydney Security Exhibition. Great local presence!', 'We''re working with some excellent cybersecurity sales managers in the Sydney market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their regional teams.', 'I see you''re building out your team in Sydney. How are you finding the local cybersecurity talent market? We''re noticing some interesting shifts in the talent landscape, particularly around sales manager hires in the cybersecurity space. With OPSWAT''s strong local presence through events like the Security Exhibition and OT Cyber Resilience Summit, you''re probably seeing the demand for quality talent firsthand.', '2025-09-20T14:18:26.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recXLlPst3eiT9anW' 
       OR (LOWER(name) = LOWER('Ian Berkery') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAHUvyUBu9nKhYs1XURqQZ5ev--qSBKMKDA' )
);
-- Insert: Keith Chan (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recXLpE9zwrEMHXGW', 'Keith Chan', NULL, 'https://www.linkedin.com/in/ACwAAAzTTocB58LARl1bZUouDzhX5UYmdDxlSF0', 'Head of APAC Partnerships', 'Sydney, New South Wales, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Love the Surry Hills office expansion. That''s exciting growth!', 'We''re seeing some excellent account management talent in the Sydney market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.', 'I see you''re scaling the sales team in Sydney. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around account management hires in the SaaS space. The Launchpad community has been sharing some great insights about what''s working in Sydney right now.', '2025-09-20T06:31:33.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recXLpE9zwrEMHXGW' 
       OR (LOWER(name) = LOWER('Keith Chan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAzTTocB58LARl1bZUouDzhX5UYmdDxlSF0' )
);
-- Insert: Coreen Chia (CONNECTED)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recXNH4JVf6DjTdaj', 'Coreen Chia', NULL, 'https://www.linkedin.com/in/coreen-chia', 'Sales Manager', 'Singapore, Singapore', 'connected', 'Medium', 'LinkedIn Job Posts', NOW(), 'Congrats on closing the AIB Merchant Services acquisition! That''s fantastic news for the European expansion.', 'We''re working with some excellent Sales Director candidates across fintech if you''re looking externally.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in fintech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recXNH4JVf6DjTdaj' 
       OR (LOWER(name) = LOWER('Coreen Chia') OR linkedin_url = 'https://www.linkedin.com/in/coreen-chia' )
);
-- Insert: Tim Clark (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recXOkfm1HFZLxhMN', 'Tim Clark', NULL, 'https://www.linkedin.com/in/timcwclark', 'Partner, Growth', 'Sydney, Australia', 'new', NULL, '', NULL, 'Great to connect Tim! Love seeing growth partners driving strategic expansion in the market.', 'We''re working with some excellent Sales Director candidates across enterprise software.', 'I see you''re building out your team for Think & Grow. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in enterprise software.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recXOkfm1HFZLxhMN' 
       OR (LOWER(name) = LOWER('Tim Clark') OR linkedin_url = 'https://www.linkedin.com/in/timcwclark' )
);
-- Insert: Soumi Mukherjee (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recXUSd7NR8uN6n4H', 'Soumi Mukherjee', NULL, 'https://www.linkedin.com/in/ACwAAACsja8By4ORabsg6shBgP8MFUfy8eebGLc', 'Sales Director Australia & New Zealand ', 'Greater Brisbane Area, Australia', 'new', NULL, '', NULL, 'Saw the Frost Radar Leader news for MDR. Congrats on the recognition!', 'We''re working with some experienced Sales Managers in cybersecurity at the moment. We helped HubSpot and Docusign with similar roles during their growth phases.', 'I see you''re building out your team. How are you finding the cybersecurity talent market in ANZ? We''re noticing some interesting shifts, particularly around Sales Manager hires in enterprise security.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recXUSd7NR8uN6n4H' 
       OR (LOWER(name) = LOWER('Soumi Mukherjee') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACsja8By4ORabsg6shBgP8MFUfy8eebGLc' )
);
-- Insert: Cassandra Crothers (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recXf9kd6aBO3x4FX', 'Cassandra Crothers', NULL, 'https://www.linkedin.com/in/ACwAAADQ8dgBpVRcP-OvbKHXOHe7LwynZ4Z0sUI', 'Head of Sales APAC', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love seeing Dext''s growth from the Sydney office!', 'We''re working with some excellent Account Manager candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Manager hires in Sydney, particularly with the fintech growth we''re seeing. Would love to share what we''re seeing in the market if helpful.', '2025-10-01T14:13:20.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recXf9kd6aBO3x4FX' 
       OR (LOWER(name) = LOWER('Cassandra Crothers') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADQ8dgBpVRcP-OvbKHXOHe7LwynZ4Z0sUI' )
);
-- Insert: Belinda Glasson (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recXlBKOiFHrLSuz1', 'Belinda Glasson', NULL, 'https://www.linkedin.com/in/ACwAAAw0QZIBIA60RcTFRK19Yh350fbfSwD2pyM', 'Recruitment Team Lead - Asia Pacific', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Gartner Magic Quadrant recognition. Congrats on the strong showing!', 'We''re working with some excellent Sales Executives in the data space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams.', 'I see you''re building out your sales team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Executive hires in the data platform space.', '2025-09-18T21:04:44.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recXlBKOiFHrLSuz1' 
       OR (LOWER(name) = LOWER('Belinda Glasson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAw0QZIBIA60RcTFRK19Yh350fbfSwD2pyM' )
);
-- Insert: Sean Phelps (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recXvOuzd0xPTUEVL', 'Sean Phelps', NULL, 'https://www.linkedin.com/in/ACwAAA4KLGcBrsrSzy_0JizR97Rjzgvy1HgSjgA', 'General Manager, Oceania', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the $27.5M Series A news. Congrats on the funding!', 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams after major funding rounds.', 'I see you''re scaling the GTM team after the Series A. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the landscape, particularly around SDR hires in the construction tech space. With Sitemate doubling headcount, I imagine you''re seeing the challenges firsthand.', '2025-09-20T06:19:40.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recXvOuzd0xPTUEVL' 
       OR (LOWER(name) = LOWER('Sean Phelps') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA4KLGcBrsrSzy_0JizR97Rjzgvy1HgSjgA' )
);
-- Insert: Eralp Kubilay (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recYGyqZR43A8WKgJ', 'Eralp Kubilay', NULL, 'https://www.linkedin.com/in/ACwAAAChthMBNtL0BJPUbfTHSi-ie9wRUHTDP-U', 'Country Manager ANZ Regional Sales', 'Melbourne, Victoria, Australia', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-25T02:33:17.548Z', 'Congrats on the KuppingerCole leadership recognition!', 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your enterprise sales team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise AE hires in identity and cybersecurity.', '2025-09-23T14:27:00.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recYGyqZR43A8WKgJ' 
       OR (LOWER(name) = LOWER('Eralp Kubilay') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAChthMBNtL0BJPUbfTHSi-ie9wRUHTDP-U' )
);
-- Insert: Jit Shen T. (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recYHQb17gkuB0sIT', 'Jit Shen T.', NULL, 'https://www.linkedin.com/in/ACwAABLVM1sBuS2_86jcEOluVckAbOeEWHwS1gU', 'Sr Channel Sales Manager, APAC', 'Singapore, Singapore', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Love seeing the Australian team expansion at WEKA!', 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the talent market across Australia? We''re noticing some interesting shifts in the market, particularly around SDR hires in the data platform space.', '2025-09-20T06:14:59.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recYHQb17gkuB0sIT' 
       OR (LOWER(name) = LOWER('Jit Shen T.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABLVM1sBuS2_86jcEOluVckAbOeEWHwS1gU' )
);
-- Insert: Celeste Kirby-Brown (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recYfvBTpryqxpvvL', 'Celeste Kirby-Brown', NULL, 'https://www.linkedin.com/in/ACwAAADiwXQBtDeYUuD-u_jadJSOuzE5tnvE7bY', 'Executive General Manager, APAC', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the Crypto.com partnership news. Love seeing Ingenico leading the way with crypto payments.', 'We''re working with some excellent Account Directors in payments at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the payments talent market? We''re noticing some interesting shifts in the landscape, particularly around Account Director hires in fintech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recYfvBTpryqxpvvL' 
       OR (LOWER(name) = LOWER('Celeste Kirby-Brown') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADiwXQBtDeYUuD-u_jadJSOuzE5tnvE7bY' )
);
-- Insert: Praveen Kumar Chandrashekhar (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recYg9b3NpH3tjdGq', 'Praveen Kumar Chandrashekhar', NULL, 'https://www.linkedin.com/in/ACwAAACNvfsBOp-ItPhreLBIJjhX6b6M2Tqou-E', 'Vice President Sales, Asia Pacific & ME', 'Singapore', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-21T23:24:08.219Z', 'Saw the COBOL Day Sydney event. Great to see Rocket investing locally!', 'We''re working with some excellent AE candidates with enterprise software backgrounds at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.', 'I see you''re building out your Account Executive team. How are you finding the local talent market? We''re noticing some interesting shifts in the enterprise software space, particularly around AE hires with modernization experience in Sydney.', '2025-09-21T14:15:18.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recYg9b3NpH3tjdGq' 
       OR (LOWER(name) = LOWER('Praveen Kumar Chandrashekhar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACNvfsBOp-ItPhreLBIJjhX6b6M2Tqou-E' )
);
-- Insert: Louisa Jewitt (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recYmsyJwPhM5Qu3e', 'Louisa Jewitt', NULL, 'https://www.linkedin.com/in/ACwAACQbwOMBoWbnPVjgbxt-hRBlKmUIWLYAXcs', 'Head of Sales, Australia', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the Birdeye Social launch. Love seeing the AI innovation you''re driving.', 'We''re working with some great SDR candidates at the moment. We helped HubSpot and Docusign with similar roles during their growth phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in AI and SaaS.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recYmsyJwPhM5Qu3e' 
       OR (LOWER(name) = LOWER('Louisa Jewitt') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACQbwOMBoWbnPVjgbxt-hRBlKmUIWLYAXcs' )
);
-- Insert: Kimberley Duggan (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recZC4LfGf840xm6C', 'Kimberley Duggan', NULL, 'https://www.linkedin.com/in/ACwAABTVeoABlBO1Y3YxmZA24Q8GoowpRJlA9v8', 'Regional Vice President - Enterprise', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the news about the new partner program launch in APAC. That''s exciting!', 'We''re working with some strong partner sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their channel teams.', 'I see you''re building out the partner team. How are you finding the channel sales market in Australia? We''re noticing some interesting shifts in the talent landscape, particularly around Partner Sales Manager hires in SaaS.', '2025-09-18T21:00:47.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recZC4LfGf840xm6C' 
       OR (LOWER(name) = LOWER('Kimberley Duggan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABTVeoABlBO1Y3YxmZA24Q8GoowpRJlA9v8' )
);
-- Insert: Frankco Shum (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recZi1Lvur1rcqgWw', 'Frankco Shum', NULL, 'https://www.linkedin.com/in/ACwAAACtHbkBv-zQqzKwpDj6fpEuAPXVSSIwDdA', 'Senior Channel Sales Manager', 'Singapore', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Nueva partnership news. Love the Sydney expansion focus!', 'We''re working with some excellent Enterprise AE candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during their expansion phases.', 'Hope you''re well Frankco! I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in the edge security space. With all the local expansion happening at Fastly, I imagine you''re seeing some unique opportunities. Would love to chat about what we''re seeing in the market.', '2025-09-20T06:26:49.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recZi1Lvur1rcqgWw' 
       OR (LOWER(name) = LOWER('Frankco Shum') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACtHbkBv-zQqzKwpDj6fpEuAPXVSSIwDdA' )
);
-- Insert: Krina K. (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recZpi0f25tPPv5nH', 'Krina K.', NULL, 'https://www.linkedin.com/in/ACwAAAY-Vx8Bb5WtsXWOISxXGCfwKa6c_z9-dhs', 'Sales Team Leader APAC', 'Singapore', 'new', NULL, '', NULL, 'Saw the Fast Company Innovation Award news. Congrats on the recognition!', 'We''re working with some excellent Sales Executives in the EOR space at the moment. Companies like HubSpot and Docusign have found our approach helpful during their expansion phases.', 'I see you''re building out your sales team in Australia. How are you finding the EOR market here? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Executive hires in HR tech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recZpi0f25tPPv5nH' 
       OR (LOWER(name) = LOWER('Krina K.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAY-Vx8Bb5WtsXWOISxXGCfwKa6c_z9-dhs' )
);
-- Insert: Nick Best (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recZyUhykweSrhxnP', 'Nick Best', NULL, 'https://www.linkedin.com/in/ACwAAAHYWMUBvblW_kEbEOPYgbcw69SPLXJYE_Q', 'Sales Director ANZ', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the news about the new partner program launch in APAC. Love seeing the expansion into Australia.', 'We''re working with some great partner sales candidates at the moment. We helped HubSpot and Docusign build out their partner teams.', 'I see you''re building out the partner sales team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around partner sales hires in SaaS.', '2025-09-18T21:00:47.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recZyUhykweSrhxnP' 
       OR (LOWER(name) = LOWER('Nick Best') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAHYWMUBvblW_kEbEOPYgbcw69SPLXJYE_Q' )
);
-- Insert: Nick Lowther (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recaAtU4MxY5lPqB6', 'Nick Lowther', NULL, 'https://www.linkedin.com/in/ACwAAAwGVTwBO3SBJspgxl-5ys3aGXFSn8he8Cs', 'Regional Sales Manager', 'Greater Melbourne Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the PartnerTrust Live event in Melbourne. Love the local investment!', 'We''re seeing some strong Enterprise AE talent in the market who have deep public sector experience. Companies like HubSpot and Docusign have found our approach helpful when scaling their government sales teams.', 'Hope you''re well Nick! I see you''re focused on the public sector space. How are you finding the market with all the new compliance requirements? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires who understand government procurement. That IRAP PROTECTED certification must be opening up some great opportunities.', '2025-09-25T05:24:03.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recaAtU4MxY5lPqB6' 
       OR (LOWER(name) = LOWER('Nick Lowther') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAwGVTwBO3SBJspgxl-5ys3aGXFSn8he8Cs' )
);
-- Insert: ZHIWEI JIANG (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recaVNbK03ht8wB1H', 'ZHIWEI JIANG', NULL, 'https://www.linkedin.com/in/zhiwei-jiang-9678ab244', 'Sales Director', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the SNEC 2025 showcase and partnerships. Love seeing the APAC expansion.', 'We''re working with some excellent Senior Sales Managers in energy and cleantech at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.', 'I see you''re building out your team in Sydney. How are you finding the energy storage talent market? We''re noticing some interesting shifts in the landscape, particularly around Senior Sales Manager hires in cleantech and energy solutions.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recaVNbK03ht8wB1H' 
       OR (LOWER(name) = LOWER('ZHIWEI JIANG') OR linkedin_url = 'https://www.linkedin.com/in/zhiwei-jiang-9678ab244' )
);
-- Insert: Ben Pascoe (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recageLFsb0L5PXDP', 'Ben Pascoe', NULL, 'https://www.linkedin.com/in/ACwAAABfRVUB4K3FRVVwlj1eQJgg2WTXX2EkLCg', 'Sales Director - Australia and New Zealand', 'Australia', 'new', NULL, '', NULL, 'Saw the SonarQube branding unification news. Smart move bringing everything under one brand.', 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful for senior sales roles.', 'I see you''re building out your team. How are you finding the enterprise sales market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in DevOps and security.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recageLFsb0L5PXDP' 
       OR (LOWER(name) = LOWER('Ben Pascoe') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABfRVUB4K3FRVVwlj1eQJgg2WTXX2EkLCg' )
);
-- Insert: Lilli Perkin (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recazyXG9KNEG7d5Q', 'Lilli Perkin', NULL, 'https://www.linkedin.com/in/ACwAAAgHrXoBL-Qr4418pjds6rhdTyu96JGNW7s', 'Senior Client Services Manager', 'Sydney, New South Wales, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the AI-first strategy shift at 4mation. That''s exciting!', 'We''re working with some excellent business development candidates who have AI/tech backgrounds at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.', 'Hope you''re well Lilli! I see you''re building out your team at 4mation. How are you finding the local talent market with the AI focus? We''re noticing some interesting shifts in the tech space, particularly around business development hires in Sydney. The demand for people who can sell AI solutions is really picking up.', '2025-09-30T14:18:25.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recazyXG9KNEG7d5Q' 
       OR (LOWER(name) = LOWER('Lilli Perkin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAgHrXoBL-Qr4418pjds6rhdTyu96JGNW7s' )
);
-- Insert: Ellie G. (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recb2IKPsuNv6BxsY', 'Ellie G.', NULL, 'https://www.linkedin.com/in/ACwAABO51BoBwZPu4oeeTWgTejUsaIMmwAOysc4', 'Manager, Sales - Australia', 'Australia', 'new', NULL, '', NULL, 'Saw the Fontworks acquisition news. Congrats on expanding into Japan!', 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in creative tech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recb2IKPsuNv6BxsY' 
       OR (LOWER(name) = LOWER('Ellie G.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABO51BoBwZPu4oeeTWgTejUsaIMmwAOysc4' )
);
-- Insert: Darren Ward (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recb5fr05C9GwY1m1', 'Darren Ward', NULL, 'https://www.linkedin.com/in/ACwAAAYOMIYBa-fPMsySKdf7d6NxPVZr5O-2i9g', 'Director of Strategic Enterprise & Government ', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Protect Tour 2025 in Sydney. Great event!', 'We''re working with some excellent BDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.', 'Hope you''re well! I see you''re building out your BDR team. How are you finding the local talent market? We''re noticing some interesting shifts around sales development hiring in Sydney, particularly with the cybersecurity focus. Would love to chat about what we''re seeing.', '2025-09-23T14:35:44.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recb5fr05C9GwY1m1' 
       OR (LOWER(name) = LOWER('Darren Ward') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAYOMIYBa-fPMsySKdf7d6NxPVZr5O-2i9g' )
);
-- Insert: Sally Matheson (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recb7PiXiU28QVGFm', 'Sally Matheson', NULL, 'https://www.linkedin.com/in/sally-matheson-0ba9b41', 'Executive Search Recruiter', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw you''re with Niche 212. Love the work you''re doing in executive search.', 'Hope you''re well! We''re working with some strong Strategic Sales Manager candidates in Melbourne. Happy to chat if useful.', 'I see you''re hiring a Strategic Sales Manager in Melbourne. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recb7PiXiU28QVGFm' 
       OR (LOWER(name) = LOWER('Sally Matheson') OR linkedin_url = 'https://www.linkedin.com/in/sally-matheson-0ba9b41' )
);
-- Insert: Gerry Tucker (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recb7WOwJEWYvf8cB', 'Gerry Tucker', NULL, 'https://www.linkedin.com/in/ACwAAAAcVxwBS4-YdSokPHeD0VxUL4frMzW-GCQ', 'Director of Sales Large Entreprise', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love Sprinklr''s international expansion focus. Exciting growth!', 'We''re working with some excellent enterprise SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in enterprise SaaS. Would love to share what we''re seeing and hear your thoughts on the current state of things.', '2025-09-20T14:22:21.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recb7WOwJEWYvf8cB' 
       OR (LOWER(name) = LOWER('Gerry Tucker') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAcVxwBS4-YdSokPHeD0VxUL4frMzW-GCQ' )
);
-- Insert: Jeannine Winiata (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recb9z4p24spoAYF0', 'Jeannine Winiata', NULL, 'https://www.linkedin.com/in/ACwAAADjOGgBouLsUSM5EpH3OTeUacS34o7L47A', 'New Business Sales Director', 'Greater Sydney Area', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-21T23:28:58.273Z', 'Saw the Employee Compliance Module launch. Great local focus!', 'We''re working with some excellent Account Manager candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Manager hires in the HR tech space, particularly with companies scaling their CoreHR offerings in Sydney.', '2025-09-20T06:17:35.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recb9z4p24spoAYF0' 
       OR (LOWER(name) = LOWER('Jeannine Winiata') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADjOGgBouLsUSM5EpH3OTeUacS34o7L47A' )
);
-- Insert: Mark Coughlan (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recbG8xZw0zaD1CDp', 'Mark Coughlan', NULL, 'https://www.linkedin.com/in/ACwAAAcWH-4BxLjUyIOP3IPE5m8rplvgZrWQJUU', 'VP Sales - APAC', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the capital raising initiative. Great move!', 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out their sales development teams.', 'I see you''re building out your sales team. How are you finding the Sydney talent market? We''re noticing some interesting shifts around SDR hiring, particularly with companies scaling their go-to-market teams after funding rounds. The quality of candidates coming through has been really strong lately.', '2025-09-28T04:07:36.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recbG8xZw0zaD1CDp' 
       OR (LOWER(name) = LOWER('Mark Coughlan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAcWH-4BxLjUyIOP3IPE5m8rplvgZrWQJUU' )
);
-- Insert: Shane Ullman (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recbO7wpxaiZGhb7x', 'Shane Ullman', NULL, 'https://www.linkedin.com/in/ACwAAAp97e4BXmJ0t8elSzfIHEmw7D7Q1yYLenY', 'Associate Manager, Sales Development APAC', 'Greater Sydney Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Love what Vimeo''s doing in the video space. Hope you''re well Shane!', 'We''re working with some excellent senior sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC teams.', 'I see you''re covering the APAC region for Vimeo. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around senior sales hires in the video tech space. Always keen to connect with leaders like yourself who are building across the region.', '2025-09-29T14:15:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recbO7wpxaiZGhb7x' 
       OR (LOWER(name) = LOWER('Shane Ullman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAp97e4BXmJ0t8elSzfIHEmw7D7Q1yYLenY' )
);
-- Insert: Scott Bocksette (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recbRmC5NLtPLM714', 'Scott Bocksette', NULL, 'https://www.linkedin.com/in/ACwAACiGdtwBPGmT_f_19CzXT_Jgtw4EtiW5g98', 'National Sales Manager', 'Bonbeach, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the electric outdoor forklift launch. Great timing!', 'We''re working with some excellent sales professionals in the equipment sector at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their commercial teams.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around sales hires in the equipment space, particularly with companies focusing on sustainability initiatives like yours.', '2025-09-25T05:19:37.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recbRmC5NLtPLM714' 
       OR (LOWER(name) = LOWER('Scott Bocksette') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACiGdtwBPGmT_f_19CzXT_Jgtw4EtiW5g98' )
);
-- Insert: James Jeffson (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recbay8x0sFgO75ia', 'James Jeffson', NULL, 'https://www.linkedin.com/in/james-jeffson-715774317', 'Sales Manager', 'Homebush, Australia', 'new', NULL, '', NULL, 'Saw the Q2 results news. That 22% revenue growth is impressive!', 'Hope you''re well! We''re working with some strong Sales Ops candidates at the moment. Happy to chat if useful.', 'I see you''re hiring for a Sales Ops role at JD.COM. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recbay8x0sFgO75ia' 
       OR (LOWER(name) = LOWER('James Jeffson') OR linkedin_url = 'https://www.linkedin.com/in/james-jeffson-715774317' )
);
-- Insert: Ash Gibbs (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recbcwXMuPfFhupxL', 'Ash Gibbs', NULL, 'https://www.linkedin.com/in/ACwAAABXU7gBFiOagMxMNU4okFLvMrKtTwYAjFU', 'Director Of Operations', 'Greater Melbourne Area, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Gartner Magic Quadrant news. Congrats on the Visionary recognition!', 'We''re working with some excellent Senior AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team in Australia. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Senior AE hires in the communications space.', '2025-09-17T14:30:06.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recbcwXMuPfFhupxL' 
       OR (LOWER(name) = LOWER('Ash Gibbs') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABXU7gBFiOagMxMNU4okFLvMrKtTwYAjFU' )
);
-- Insert: Mamoon Huda (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recbiibX6zqm7G4Bc', 'Mamoon Huda', NULL, 'https://www.linkedin.com/in/ACwAAADX1osBXQrG223XEaODsf8lLxxGAbqQebU', 'Principal Project Manager (Director, Professional Services)', 'Greater Sydney Area, Australia', 'new', NULL, '', NULL, 'Saw the Business Intelligence Platform of the Year award news. Congrats on the recognition!', 'We''re working with some experienced Key Account Managers in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful for similar roles.', 'I see you''re building out your Key Account Management team. How are you finding the fintech talent market? We''re noticing some interesting shifts in the landscape, particularly around senior account management hires in financial services.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recbiibX6zqm7G4Bc' 
       OR (LOWER(name) = LOWER('Mamoon Huda') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADX1osBXQrG223XEaODsf8lLxxGAbqQebU' )
);
-- Insert: Andrew Rae (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recboXR03VUOJD8An', 'Andrew Rae', NULL, 'https://www.linkedin.com/in/andyrae', 'Head of SMB and Channel', 'Bendigo, Australia', 'new', NULL, '', NULL, 'Saw the Series G funding news. $450M is incredible - congrats!', 'We''re working with some strong Sales Development Manager candidates at the moment.', 'I see you''re hiring a Sales Development Manager at Rippling. How''s the search going? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recboXR03VUOJD8An' 
       OR (LOWER(name) = LOWER('Andrew Rae') OR linkedin_url = 'https://www.linkedin.com/in/andyrae' )
);
-- Insert: Mzi Mpande (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recbsysZbBHKUE3FU', 'Mzi Mpande', NULL, 'https://www.linkedin.com/in/ACwAACmHa5ABMaPCLNVVrHgGg5hh2nvvfFf7Fc0', 'Sales Manager - Jobs', 'Sydney, New South Wales, Australia', 'new', NULL, '', NULL, 'Saw the AdFixus partnership news. Great move for digital advertising capabilities.', 'We''re working with some strong sales professionals in the marketplace space. We''ve helped HubSpot and Docusign with similar roles during growth phases.', 'I see you''re building out your team. How are you finding the marketplace talent market? We''re noticing some interesting shifts, particularly around sales hires in classifieds and marketplace businesses.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recbsysZbBHKUE3FU' 
       OR (LOWER(name) = LOWER('Mzi Mpande') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACmHa5ABMaPCLNVVrHgGg5hh2nvvfFf7Fc0' )
);
-- Insert: Michael Small (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recbu6mhnGMEe1774', 'Michael Small', NULL, 'https://www.linkedin.com/in/smallmike', 'Head of Growth, APAC', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the AI-first strategy announcement at Sage Future 2025. Exciting direction for APAC growth!', 'We''re working with some excellent SDR candidates in the finance software space at the moment. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your team. How are you finding the market for SDRs across APAC? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in finance software.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recbu6mhnGMEe1774' 
       OR (LOWER(name) = LOWER('Michael Small') OR linkedin_url = 'https://www.linkedin.com/in/smallmike' )
);
-- Insert: Lahif Yalda (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recbzJiGjxMFIbqoR', 'Lahif Yalda', NULL, 'https://www.linkedin.com/in/ACwAAAIQhfwBoW60ZiXYOgw9Zu1zd_-LFgwvqos', 'Channel Sales Director', 'Melbourne, Victoria, Australia', 'messaged', 'High', 'LinkedIn Job Posts', '2025-09-21T23:32:06.377Z', 'Saw the August platform updates. Love seeing the new Builder UI and Flow Builder improvements.', 'We''re working with some excellent Commercial AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Commercial AE hires in integration and automation.', '2025-09-18T20:53:34.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recbzJiGjxMFIbqoR' 
       OR (LOWER(name) = LOWER('Lahif Yalda') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAIQhfwBoW60ZiXYOgw9Zu1zd_-LFgwvqos' )
);
-- Insert: Declan Keir-Saks (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recc4aVp6uEUW7QA7', 'Declan Keir-Saks', NULL, 'https://www.linkedin.com/in/declankeirsaks', 'Senior Sales Manager at Square', 'Melbourne, Australia', 'new', NULL, '', NULL, 'Love seeing the Square Handheld launch. That''s a game changer for sellers.', 'We''re working with some great onboarding specialists at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their seller enablement teams.', 'I see you''re building out your seller onboarding team. How are you finding the market? With all the new Square product launches, onboarding complexity must be growing. We''re seeing some interesting shifts in the talent landscape, particularly around onboarding specialist hires in fintech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recc4aVp6uEUW7QA7' 
       OR (LOWER(name) = LOWER('Declan Keir-Saks') OR linkedin_url = 'https://www.linkedin.com/in/declankeirsaks' )
);
-- Insert: Allie B. (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recc4ha5ShE9mR21c', 'Allie B.', NULL, 'https://www.linkedin.com/in/ACwAAAn2HIIBFWR7I08997kWFIpt9xGz6dWKb-M', 'Director of Go To Market - SMB | Oceania', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the $27.5M Series A news. That''s exciting growth!', 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases like yours.', 'I see you''re building out your GTM team. How are you finding the Sydney talent market? We''re noticing some interesting shifts around SDR hires, particularly with companies scaling as fast as Sitemate. The doubling of headcount must be keeping you busy on the hiring front.', '2025-09-20T06:19:41.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recc4ha5ShE9mR21c' 
       OR (LOWER(name) = LOWER('Allie B.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAn2HIIBFWR7I08997kWFIpt9xGz6dWKb-M' )
);
-- Insert: Jeremy Pell (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recc9Ou0EBKyldwUG', 'Jeremy Pell', NULL, 'https://www.linkedin.com/in/ACwAAADJxGoBSH1Bf2LOXTCEWoFrCoqFPDuophg', 'Country Manager AVP', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Tech Data partnership announcement. Great move for the ANZ market!', 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their government sales teams.', 'I see you''re building out your team. How are you finding the talent market for enterprise roles? We''re noticing some interesting shifts, particularly around Enterprise AE hires in the government sector. The Tech Data partnership should open up some great opportunities for growth.', '2025-09-20T14:29:06.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recc9Ou0EBKyldwUG' 
       OR (LOWER(name) = LOWER('Jeremy Pell') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADJxGoBSH1Bf2LOXTCEWoFrCoqFPDuophg' )
);
-- Insert: Damian Trubiano (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reccBCYYsNHwwSegp', 'Damian Trubiano', NULL, 'https://www.linkedin.com/in/damiantrubiano', 'Industrial IoT Sales Manager Australia', 'Melbourne, Australia', 'new', NULL, '', NULL, 'Saw the iF Design Award news for the WISE-IoT solution. Congrats on the win!', 'Hope you''re well! We''re working with some strong Key Account Manager candidates in the IoT space. Happy to chat if useful.', 'I see you''re hiring a Key Account Manager at Advantech. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reccBCYYsNHwwSegp' 
       OR (LOWER(name) = LOWER('Damian Trubiano') OR linkedin_url = 'https://www.linkedin.com/in/damiantrubiano' )
);
-- Insert: Mandy Gallie (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reccQGZbayt51GyiT', 'Mandy Gallie', NULL, 'https://www.linkedin.com/in/mandy-gallie-3793871', 'Vice President, Mastercard, Loyalty Sales Asia Pacific', 'St Leonards, Australia', 'new', NULL, '', NULL, 'Saw the On-Demand Decisioning launch. Love seeing Mastercard''s innovation in the payments space.', 'We''re working with some excellent consulting sales leaders at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their consulting functions.', 'I see you''re building out your loyalty consulting team. How are you finding the market for senior consulting sales talent? We''re noticing some interesting shifts in the talent landscape, particularly around Director level hires in fintech and payments.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reccQGZbayt51GyiT' 
       OR (LOWER(name) = LOWER('Mandy Gallie') OR linkedin_url = 'https://www.linkedin.com/in/mandy-gallie-3793871' )
);
-- Insert: Andrew Walford (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reccRG3MV4DHHrhG3', 'Andrew Walford', NULL, 'https://www.linkedin.com/in/ACwAABkUAH0Bd4h_0bL9eGFTa8j0uyf26NVR-mM', 'Senior Sales Manager', 'Greater Sydney Area, Australia', 'new', NULL, '', NULL, 'Saw the G2 award news. Congrats on being #1 IT Infrastructure Software!', 'We''re working with some strong Sales Managers with retail tech and international expansion experience. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re expanding internationally and ramping up sales investment. How are you finding the talent market for your European push? We''re noticing some interesting shifts in the retail tech space, particularly around Sales Manager hires with international experience.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reccRG3MV4DHHrhG3' 
       OR (LOWER(name) = LOWER('Andrew Walford') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABkUAH0Bd4h_0bL9eGFTa8j0uyf26NVR-mM' )
);
-- Insert: Yamato Toda (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reccTaDY8ulymbfAI', 'Yamato Toda', NULL, 'https://www.linkedin.com/in/ACwAACZ5KN8BNggEI6yaoJSRWnVltBMtz66X6Ww', 'Senior Outbound Business Representative', 'Sydney, New South Wales, Australia', 'new', 'Low', 'LinkedIn Job Posts', NULL, 'Saw the BoxWorks AI launch news. Love seeing the new direction with Box Shield Pro and automation.', 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in SaaS with the AI boom happening.', '2025-09-17T14:26:33.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reccTaDY8ulymbfAI' 
       OR (LOWER(name) = LOWER('Yamato Toda') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACZ5KN8BNggEI6yaoJSRWnVltBMtz66X6Ww' )
);
-- Insert: Dajana Büchner (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reccVJFihuNqN6JsP', 'Dajana Büchner', NULL, 'https://www.linkedin.com/in/ACwAAAVOgdIBou3mUNl4O8dGx3jkDbK0yaBwF64', 'Revenue Operations Specialist', 'Brisbane City, Queensland, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the AI-powered LMS updates. Love the innovation focus!', 'We''re working with some excellent B2B sales candidates in Brisbane at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams in competitive markets.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around B2B sales hires in Brisbane, particularly with companies scaling their SaaS teams. The Launchpad community has been buzzing about the challenges and opportunities in the edtech space.', '2025-09-23T14:41:12.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reccVJFihuNqN6JsP' 
       OR (LOWER(name) = LOWER('Dajana Büchner') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAVOgdIBou3mUNl4O8dGx3jkDbK0yaBwF64' )
);
-- Insert: Adrian Towsey (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recd5JmI82hfAdoTk', 'Adrian Towsey', NULL, 'https://www.linkedin.com/in/adriantowsey', 'Vice President Commercial Sales APJ', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the news about Datadog''s expansion into India and the Middle East. Love seeing the AI observability focus.', 'We''re working with some excellent Sales Engineers with AI and observability backgrounds. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.', 'I see you''re building out your Sales Engineering team. How are you finding the market for technical talent in the AI space? We''re noticing some interesting shifts, particularly around Sales Engineering hires in observability and AI platforms.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recd5JmI82hfAdoTk' 
       OR (LOWER(name) = LOWER('Adrian Towsey') OR linkedin_url = 'https://www.linkedin.com/in/adriantowsey' )
);
-- Insert: Thomas Godfrey (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recdHWFt5h9Lu5Wka', 'Thomas Godfrey', NULL, 'https://www.linkedin.com/in/ACwAAAUSg8EBbwCVZnx3yT0i__4hEdkihB39VdQ', 'Sales Account Executive', 'Brisbane, Queensland, Australia', 'new', NULL, '', NULL, 'Saw the Emerson merger news. Congrats on the acquisition!', 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in industrial tech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recdHWFt5h9Lu5Wka' 
       OR (LOWER(name) = LOWER('Thomas Godfrey') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAUSg8EBbwCVZnx3yT0i__4hEdkihB39VdQ' )
);
-- Insert: Andrew Cannington (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recdO13f3i2pR82uY', 'Andrew Cannington', NULL, 'https://www.linkedin.com/in/ACwAAABUKEEBsrsCK_RhU67OCn0UbFaOVbM1GJs', 'GM (APAC) @ Cresta', 'Melbourne, Victoria, Australia', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-21T23:26:07.625Z', 'Saw the Melbourne office launch! Exciting expansion into APAC.', 'We''re working with some excellent strategic sales candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC teams.', 'Hope you''re settling in well to the new role! I see you''re building out the team in Melbourne. How are you finding the local talent market? We''re noticing some interesting shifts in the sales talent landscape, particularly around strategic sales director hires in the AI space. Would love to share what we''re seeing if it''s helpful.', '2025-09-20T14:16:51.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recdO13f3i2pR82uY' 
       OR (LOWER(name) = LOWER('Andrew Cannington') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABUKEEBsrsCK_RhU67OCn0UbFaOVbM1GJs' )
);
-- Insert: Charlie Wood (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recdTJKjBJwk9AFR6', 'Charlie Wood', NULL, 'https://www.linkedin.com/in/ACwAABT_5uQBNnpxbPA4Xet_TUyTHylzO_gfRnQ', 'Regional Sales Director - Asia', 'Singapore, Singapore', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the PartnerTrust Live event in Melbourne. Great partner focus!', 'We''re seeing some strong enterprise account managers with public sector experience in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out their government focused teams.', 'I see you''re focused on the public sector space. How are you finding the talent market in Sydney? We''re noticing some interesting shifts around enterprise sales hiring, particularly with the increased focus on government compliance and IRAP requirements. The demand for people who understand both the tech and regulatory side seems to be growing.', '2025-09-25T05:24:02.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recdTJKjBJwk9AFR6' 
       OR (LOWER(name) = LOWER('Charlie Wood') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABT_5uQBNnpxbPA4Xet_TUyTHylzO_gfRnQ' )
);
-- Insert: Julien Fouter (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recdX0R1jygaSc8Fj', 'Julien Fouter', NULL, 'https://www.linkedin.com/in/julien-fouter-8631a1', 'Vice President of Sales APAC', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the Series C news. Congrats on the €47.9M funding!', 'We''re working with some excellent Account Manager candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.
', 'I see you''re building out your Account Manager team in Sydney. How are you finding the enterprise sales talent market in APAC? We''re noticing some interesting shifts in the landscape, particularly around AM hires in SaaS and procurement tech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recdX0R1jygaSc8Fj' 
       OR (LOWER(name) = LOWER('Julien Fouter') OR linkedin_url = 'https://www.linkedin.com/in/julien-fouter-8631a1' )
);
-- Insert: Dermot McCutcheon (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recdZJGS2OcWzGcsM', 'Dermot McCutcheon', NULL, 'https://www.linkedin.com/in/dermotmccutcheon', 'Director Solutions Sales', 'Melbourne, Australia', 'in queue', NULL, 'LinkedIn Job Posts', NOW(), 'Saw KPMG completed the digital transformation. That''s a massive achievement after 3 years.', 'We''re working with some strong Salesforce leaders in consulting. Happy to chat if useful.', 'I see KPMG is hiring a Salesforce Director. How''s the search going? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recdZJGS2OcWzGcsM' 
       OR (LOWER(name) = LOWER('Dermot McCutcheon') OR linkedin_url = 'https://www.linkedin.com/in/dermotmccutcheon' )
);
-- Insert: Pascal Budd (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recdZJPXwj3CNVi1b', 'Pascal Budd', NULL, 'https://www.linkedin.com/in/pascalbudd', 'Senior Key Accounts Manager, South East Asia', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the Ingram Micro partnership announcement. Great move for expanding reach.', 'Hope you''re well! We''re working with some strong Consulting Engineers in the Apple ecosystem. Happy to chat if useful.', 'I see you''re hiring Consulting Engineers at Jamf. How are you finding the market? We work with companies like HubSpot on similar technical roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recdZJPXwj3CNVi1b' 
       OR (LOWER(name) = LOWER('Pascal Budd') OR linkedin_url = 'https://www.linkedin.com/in/pascalbudd' )
);
-- Insert: Florence Douyere (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recdnmyN4W7en07cO', 'Florence Douyere', NULL, 'https://www.linkedin.com/in/ACwAAAAxwV4BGnDPv0nScs9kRRTj9SJh1KhvquM', 'Country Manager, Australia and New Zealand', 'Sydney, Australia', 'messaged', NULL, 'LinkedIn Job Posts', '2025-09-19T05:28:38.290Z', 'Saw the Qlik Connect launch news. Love seeing the new AI tools - looks exciting.', 'We''re working with some excellent Enterprise AE candidates in data and analytics at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the Enterprise AE market in data and analytics? We''re noticing some interesting shifts in the talent landscape, particularly around senior sales hires in the data space.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recdnmyN4W7en07cO' 
       OR (LOWER(name) = LOWER('Florence Douyere') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAxwV4BGnDPv0nScs9kRRTj9SJh1KhvquM' )
);
-- Insert: Will Hiebert (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recdwUoxasVJtKqG2', 'Will Hiebert', NULL, 'https://www.linkedin.com/in/ACwAAAKneMMBWXxgUwXv917SlLqPC20MZUbKi50', 'Regional Vice President, APJ', 'Australia', 'messaged', 'High', 'LinkedIn Job Posts', '2025-09-21T23:32:23.408Z', 'Saw the Series F news. Congrats on the funding!', 'We''re working with some excellent Strategic AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.', 'I see you''re building out your team. How are you finding the Strategic AE market in Australia? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise AI sales hires.', '2025-09-18T20:56:08.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recdwUoxasVJtKqG2' 
       OR (LOWER(name) = LOWER('Will Hiebert') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKneMMBWXxgUwXv917SlLqPC20MZUbKi50' )
);
-- Insert: Elizabeth Zab (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recdylH6Zt9yA9zVZ', 'Elizabeth Zab', NULL, 'https://www.linkedin.com/in/elizabeth-zab-38ab2933b', 'Retail Sales Manager', 'Homebush, Australia', 'new', NULL, '', NULL, 'Saw the strong Q2 results news. Love seeing that 22% revenue growth!', 'Hope you''re well! We''re working with some strong Sales Ops candidates at the moment. Happy to chat if useful.', 'I see you''re hiring for a Sales Ops role at JD.COM. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recdylH6Zt9yA9zVZ' 
       OR (LOWER(name) = LOWER('Elizabeth Zab') OR linkedin_url = 'https://www.linkedin.com/in/elizabeth-zab-38ab2933b' )
);
-- Insert: Grant S. (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recdzqyOZ9J0eOzfX', 'Grant S.', NULL, 'https://www.linkedin.com/in/ACwAAAU5XzsBcGcPRlx6Aa3hly90N7GL0DmV68c', 'Enterprise Account Executive, APAC', 'Sydney, New South Wales, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Sydney HQ launch news. That''s exciting!', 'We''re working with some excellent sales candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases like yours.', 'I see you''re building out the sales team there. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around sales hires in Sydney. With Notion doubling the team size, I imagine you''re seeing plenty of opportunity but also some unique challenges in finding the right people.', '2025-09-25T01:28:49.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recdzqyOZ9J0eOzfX' 
       OR (LOWER(name) = LOWER('Grant S.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAU5XzsBcGcPRlx6Aa3hly90N7GL0DmV68c' )
);
-- Insert: Ben Chandra (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'receI8vaZ90meP1dp', 'Ben Chandra', NULL, 'https://www.linkedin.com/in/ben-chandra', 'Regional Sales Director - Australia, New Zealand and Indonesia ', 'Sydney, Australia', 'new', NULL, '', NULL, 'Congrats on the strategic partnerships with Riyadh Air and LIFT! That''s fantastic news.', 'We''re working with some excellent Account Manager candidates across enterprise software if you''re looking externally.', 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Manager hires in enterprise software.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'receI8vaZ90meP1dp' 
       OR (LOWER(name) = LOWER('Ben Chandra') OR linkedin_url = 'https://www.linkedin.com/in/ben-chandra' )
);
-- Insert: James Harkin (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'receOnEBj8hfVrylp', 'James Harkin', NULL, 'https://www.linkedin.com/in/jamesbharkin', 'APAC Senior Sales Director at Lucid', 'Sydney, Australia', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), 'Saw the airfocus acquisition news. Great move expanding the product suite!', 'We''re working with some excellent Account Executives in APAC at the moment. Companies like HubSpot and Docusign have found our approach helpful during their expansion phases.', 'I see you''re building out your APAC team. How are you finding the market for Account Executives? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise AE hires in visual collaboration and SaaS.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'receOnEBj8hfVrylp' 
       OR (LOWER(name) = LOWER('James Harkin') OR linkedin_url = 'https://www.linkedin.com/in/jamesbharkin' )
);
-- Insert: Adam Furness, GAICD (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'receR0hqVVTnpUNIf', 'Adam Furness, GAICD', NULL, 'https://www.linkedin.com/in/ACwAAAGjvXwBK7N2PovSM8bhD4dgLzkrNer7-Nc', 'Managing Director - APJ', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the iPX Sydney event news. That''s exciting growth!', 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Executive hires in Sydney, particularly with the partnership marketing space heating up.', '2025-09-20T06:39:06.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'receR0hqVVTnpUNIf' 
       OR (LOWER(name) = LOWER('Adam Furness, GAICD') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAGjvXwBK7N2PovSM8bhD4dgLzkrNer7-Nc' )
);
-- Insert: Ethan Ng (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'receYyczog7cgZ3Tq', 'Ethan Ng', NULL, 'https://www.linkedin.com/in/ACwAAADeS7cBS9x-vocWN56exG63lngBdgq5k8M', 'Regional Executive - ANZ', 'Sydney, New South Wales, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Sydney data centre launch. Exciting local expansion!', 'We''re working with some excellent enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out their local sales teams.', 'Hope you''re settling into the AE role well! How are you finding the local talent market with all the expansion happening? We''re seeing some interesting shifts around enterprise sales hiring in Melbourne, particularly with companies scaling their data sovereignty offerings.', '2025-09-20T06:12:56.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'receYyczog7cgZ3Tq' 
       OR (LOWER(name) = LOWER('Ethan Ng') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADeS7cBS9x-vocWN56exG63lngBdgq5k8M' )
);
-- Insert: Simon Laskaj (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recefL6OaIeILPSTk', 'Simon Laskaj', NULL, 'https://www.linkedin.com/in/ACwAAAOY3NYBpBZX4hi7-PMLfbz16nJB8MhWQMo', 'Regional Director - Australia & New Zealand', 'Melbourne, Victoria, Australia', 'messaged', 'High', 'LinkedIn Job Posts', '2025-09-21T23:32:32.827Z', 'Saw the WarpStream acquisition news. Great move for expanding the platform.', 'We''re working with some excellent enterprise AEs at the moment. Companies like HubSpot and Docusign have found our approach helpful for strategic sales roles.', 'I see you''re building out your team. How are you finding the enterprise sales market? We''re noticing some interesting shifts in the talent landscape, particularly around strategic AE hires in data streaming and SaaS.', '2025-09-18T20:58:43.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recefL6OaIeILPSTk' 
       OR (LOWER(name) = LOWER('Simon Laskaj') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOY3NYBpBZX4hi7-PMLfbz16nJB8MhWQMo' )
);
-- Insert: Carol Cao (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recequhWOVaRcPtuQ', 'Carol Cao', NULL, 'https://www.linkedin.com/in/ACwAAA3eC7oBNGIS54wsSTnXDchsIoyLaPnkTYE', 'Director, Sales Operations & Excellence – APAC', 'Singapore, Singapore', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the ESET Connect 2025 launch. Love the partner enablement focus!', 'We''re working with some excellent channel sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their partner teams.', 'Hope you''re well Carol! I see you''re building out your channel sales team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around channel sales hires in cybersecurity. With all the partner enablement work ESET is doing, I imagine finding the right people who understand both the technical side and partner relationships is crucial. Would love to chat about what we''re seeing in the market.', '2025-09-22T14:17:18.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recequhWOVaRcPtuQ' 
       OR (LOWER(name) = LOWER('Carol Cao') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA3eC7oBNGIS54wsSTnXDchsIoyLaPnkTYE' )
);
-- Insert: Cat Rutledge Jones (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'receqv65cNluFg5Uy', 'Cat Rutledge Jones', NULL, 'https://www.linkedin.com/in/catrutledge', 'Australia/New Zealand Sales Leader', 'Sydney, Australia', 'messaged', NULL, 'LinkedIn Job Posts', NOW(), 'Love seeing Atlassian hit $5.2B revenue. What a milestone!', 'Hope you''re well! We''re working with some experienced partner sales candidates in the ANZ market. Happy to chat if useful.', 'I see you''re hiring a Partner Sales Manager ANZ at Atlassian. How are you finding the market? We work with companies like HubSpot on similar partner roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'receqv65cNluFg5Uy' 
       OR (LOWER(name) = LOWER('Cat Rutledge Jones') OR linkedin_url = 'https://www.linkedin.com/in/catrutledge' )
);
-- Insert: James O''Sullivan (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'receukE28AMV2hypI', 'James O''Sullivan', NULL, 'https://www.linkedin.com/in/ACwAAAVQ7gMBejjqpaLiQyHMmK3zUKCB1Bu9KqU', 'VP Sales, APAC', 'Canberra, Australian Capital Territory, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the COBOL Day Sydney event. Great to see local engagement!', 'We''re working with some excellent AE candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in Sydney. With all the expansion activity happening at Rocket, I imagine you''re seeing strong demand for quality AE talent.', '2025-09-21T14:15:18.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'receukE28AMV2hypI' 
       OR (LOWER(name) = LOWER('James O''Sullivan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAVQ7gMBejjqpaLiQyHMmK3zUKCB1Bu9KqU' )
);
-- Insert: Gregg McCallum (REPLIED)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recewHOO4mLBZQp6o', 'Gregg McCallum', NULL, 'https://www.linkedin.com/in/ACwAAAruFlEBUTKgHjUMxpI7cirQGFrHtyPO-qw', 'Regional Sales Director, APAC', 'Sydney, Australia', 'replied', NULL, 'LinkedIn Job Posts', NOW(), 'Saw the ITEL acquisition news. That''s a smart move expanding into insurance tech!', 'We''re working with some excellent AEs in the insurance tech space at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.', 'I see you''re building out your team. How are you finding the insurance tech market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in proptech and location intelligence.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recewHOO4mLBZQp6o' 
       OR (LOWER(name) = LOWER('Gregg McCallum') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAruFlEBUTKgHjUMxpI7cirQGFrHtyPO-qw' )
);
-- Insert: Liying Lim (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recf7biGOGUvYfZQ3', 'Liying Lim', NULL, 'https://www.linkedin.com/in/ACwAAABh21EB2dNZk_teWocn-L4NBnA7fdhqH5U', 'VP Sales, APAC', 'Singapore', 'new', NULL, '', NULL, 'Saw the Fast Company Innovation Award news. Congrats on the recognition!', 'We''re working with some excellent Sales Executives in the EOR space at the moment. Companies like HubSpot and Docusign have found our approach helpful during their expansion phases.', 'I see you''re building out your team in Australia. How are you finding the EOR sales market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Executive hires in HR tech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recf7biGOGUvYfZQ3' 
       OR (LOWER(name) = LOWER('Liying Lim') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABh21EB2dNZk_teWocn-L4NBnA7fdhqH5U' )
);
-- Insert: Alexander Falkingham (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recfAo1IMsMIYZ0AY', 'Alexander Falkingham', NULL, 'https://www.linkedin.com/in/ACwAAACmx5sBboJvtS49Fq096ZB3GBBueVWUGeo', 'Regional Director - Enterprise & Public Sector JAPAC', 'Greater Sydney Area, Australia', 'new', NULL, '', NULL, 'Saw the Security Today award news for History Player Search. Congrats on the win!', 'We''re working with some strong enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your enterprise team. How are you finding the security talent market in Sydney? We''re noticing some interesting shifts, particularly around enterprise sales hires with Verkada''s rapid growth to 25k customers.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recfAo1IMsMIYZ0AY' 
       OR (LOWER(name) = LOWER('Alexander Falkingham') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACmx5sBboJvtS49Fq096ZB3GBBueVWUGeo' )
);
-- Insert: Rocco De Villiers (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recfCv1I2GjfXj3hx', 'Rocco De Villiers', NULL, 'https://www.linkedin.com/in/ACwAAAYt9g4BB-n8arRZOg7MttjLi9-Lq1qtcuA', 'Director, Sales & Strategy', 'Greater Sydney Area, Australia', 'new', NULL, '', NULL, 'Saw the UNSW TRaCE partnership news. Love seeing the focus on clean energy tech.', 'We''re working with some excellent Business Development Managers in industrial tech at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the industrial automation market? We''re noticing some interesting shifts in the talent landscape, particularly around Business Development Manager hires in the automation space.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recfCv1I2GjfXj3hx' 
       OR (LOWER(name) = LOWER('Rocco De Villiers') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAYt9g4BB-n8arRZOg7MttjLi9-Lq1qtcuA' )
);
-- Insert: Tony Burnside (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recfLQOwlNxz9dKKI', 'Tony Burnside', NULL, 'https://www.linkedin.com/in/tonyburnside', 'Senior Vice President APJ', 'Melbourne, Australia', 'in queue', NULL, 'LinkedIn Job Posts', NOW(), 'Saw the IPO filing news. Exciting times ahead for Netskope!', 'We''re working with some experienced CSMs in the cybersecurity space. Happy to chat if useful.', 'I see you''re hiring CSMs in Australia. How''s the expansion going? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recfLQOwlNxz9dKKI' 
       OR (LOWER(name) = LOWER('Tony Burnside') OR linkedin_url = 'https://www.linkedin.com/in/tonyburnside' )
);
-- Insert: Changjie Wang (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recfMGTqJiR7As3AN', 'Changjie Wang', NULL, 'https://www.linkedin.com/in/ACwAAEHLdzUByF5K99of1XX98Ic4t0XdbwkEfGY', 'Business Development Team Lead', 'Singapore, Singapore', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Congrats on the $55M Series A! Biggest in payments globally', 'We''re working with some excellent BDR candidates in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling into new markets.', 'Hope you''re settling in well at KPay! I see you''re building out the Sydney team as part of the Australia expansion. How are you finding the talent market here? We''re noticing some interesting shifts in the fintech space, particularly around BDR hires who understand the payments landscape.', '2025-09-28T04:13:43.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recfMGTqJiR7As3AN' 
       OR (LOWER(name) = LOWER('Changjie Wang') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAEHLdzUByF5K99of1XX98Ic4t0XdbwkEfGY' )
);
-- Insert: Nick Martin (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recfPEIwjUm0oRUn2', 'Nick Martin', NULL, 'https://www.linkedin.com/in/ACwAAAL1axYBFxbel42gegrgSf9BNx9L7d6hVl8', 'APAC GTM Lead', 'Lake Wendouree, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the APAC expansion momentum. Great to see Remote leading the way!', 'We''re seeing some strong SDR talent in the market at the moment, especially candidates with remote selling experience. Companies like HubSpot and Docusign have found our approach helpful when building out their ANZ sales teams.', 'I see you''re building out your SDR team across ANZ. How are you finding the sales talent market across the region? We''re noticing some interesting shifts in the talent landscape, particularly around outbound SDR hires who can work effectively in remote environments. The demand for quality sales talent has definitely picked up with so many companies scaling their APAC operations.', '2025-09-28T04:09:50.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recfPEIwjUm0oRUn2' 
       OR (LOWER(name) = LOWER('Nick Martin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAL1axYBFxbel42gegrgSf9BNx9L7d6hVl8' )
);
-- Insert: Tony Fulcher (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recfSt6v2hRWBaA9V', 'Tony Fulcher', NULL, 'https://www.linkedin.com/in/ACwAAAMmzyUBvL6oCrJFnAl6TTR5-5PkZiaEq1w', 'Senior Regional Director ANZ', 'Greater Brisbane Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Sydney office expansion at Governor Phillip Tower. Great local growth!', 'We''re working with some excellent account management candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent market, particularly around account management hires in the research and advisory space. The Launchpad community has 300+ GTM leaders who''d love to connect, and through 4Twenty we''re seeing some strong candidates at the moment.', '2025-09-25T04:51:24.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recfSt6v2hRWBaA9V' 
       OR (LOWER(name) = LOWER('Tony Fulcher') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAMmzyUBvL6oCrJFnAl6TTR5-5PkZiaEq1w' )
);
-- Insert: Nick Randall (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recfjUYvznZoGN7TM', 'Nick Randall', NULL, 'https://www.linkedin.com/in/ACwAABbxuOsBKNvMc6GvjwNSJK-fMvNuymkmFaM', 'Regional Vice President Customer Growth - APAC', 'Melbourne, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the iPX Sydney event news. 250+ attendees is impressive growth!', 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent space, particularly around Account Executive hires in partnership marketing. The growth from your iPX event shows you''re clearly onto something big.', '2025-09-20T06:39:07.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recfjUYvznZoGN7TM' 
       OR (LOWER(name) = LOWER('Nick Randall') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABbxuOsBKNvMc6GvjwNSJK-fMvNuymkmFaM' )
);
-- Insert: Danni Munro (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recfm7aRHC2MAYe6F', 'Danni Munro', NULL, 'https://www.linkedin.com/in/ACwAAAKJMo0BgADw8c0GB9w34TtJ2caDbEvshh8', 'Vice President Sales ANZ', 'Greater Brisbane Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the new Brisbane head office launch. Looks incredible!', 'We''re working with some excellent BDR candidates in Brisbane at the moment. Companies like HubSpot and Docusign have found our approach helpful during these scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around BDR hires in Brisbane. The growth up there has been impressive to watch.', '2025-10-01T14:22:34.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recfm7aRHC2MAYe6F' 
       OR (LOWER(name) = LOWER('Danni Munro') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKJMo0BgADw8c0GB9w34TtJ2caDbEvshh8' )
);
-- Insert: Elisabeth Lind (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recfr6lOOPmmiM3By', 'Elisabeth Lind', NULL, 'https://www.linkedin.com/in/ACwAAC3lW5IBcBW5Elo7yDZ0xCwMbEkpJ4Tk0XE', 'Assistant Sales Manager', 'Greater Melbourne Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Love what JustCo''s doing with the King Street and Pitt Street locations!', 'We''re working with some excellent sales candidates at the moment who have strong experience in workspace solutions. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.', 'I see you''re building out your sales team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around sales executive hires in the coworking space. The demand for experienced sales professionals who understand flexible workspace solutions has really picked up lately.', '2025-09-25T04:46:18.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recfr6lOOPmmiM3By' 
       OR (LOWER(name) = LOWER('Elisabeth Lind') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAC3lW5IBcBW5Elo7yDZ0xCwMbEkpJ4Tk0XE' )
);
-- Insert: Sherryl M. (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recfwpZ4CYV72gn6g', 'Sherryl M.', NULL, 'https://www.linkedin.com/in/ACwAAALpfk0BkA3U5e0_7J5lpZ7VHA_z2K1d6TA', 'Client Consultant', 'Rushcutters Bay, New South Wales, Australia', 'new', NULL, '', NULL, 'Saw the Top Global Consumer Trends 2025 whitepaper. Great insights on the changing market landscape.', 'We''re working with some excellent Business Development candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Business Development hires in market research and data companies.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recfwpZ4CYV72gn6g' 
       OR (LOWER(name) = LOWER('Sherryl M.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAALpfk0BkA3U5e0_7J5lpZ7VHA_z2K1d6TA' )
);
-- Insert: Tom Blackman (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recfyQI93I5q3XhJf', 'Tom Blackman', NULL, 'https://www.linkedin.com/in/ACwAAANquXcBehZxpK5zPKdh9QC9jVHCPpvwELg', 'Managing Director, APAC & Japan', 'Singapore, Singapore', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-21T23:32:15.068Z', 'Saw the partnership news with Dixa. Love seeing ada''s AI-first approach to customer service.', 'We''re working with some great SDR candidates who get the AI space. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams.', 'I see you''re building out your sales team. How are you finding the market for SDR talent? We''re noticing some interesting shifts in the AI/customer service space, particularly around SDR hires who understand the technical side.', '2025-09-18T20:55:19.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recfyQI93I5q3XhJf' 
       OR (LOWER(name) = LOWER('Tom Blackman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAANquXcBehZxpK5zPKdh9QC9jVHCPpvwELg' )
);
-- Insert: Patrick Browne-Cooper (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recg2QyFYxj81bflc', 'Patrick Browne-Cooper', NULL, 'https://www.linkedin.com/in/ACwAAAMI41ABmpup5_hJWikzXGzP3mKA-UHg8Fs', 'Sales Director ANZ', 'Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Diligent Connections event coming to Sydney. Exciting lineup!', 'We''re working with some excellent BDR candidates in the Sydney market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around BDR hiring in Sydney, particularly in the GRC space with all the AI developments happening.', '2025-09-20T06:37:01.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recg2QyFYxj81bflc' 
       OR (LOWER(name) = LOWER('Patrick Browne-Cooper') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAMI41ABmpup5_hJWikzXGzP3mKA-UHg8Fs' )
);
-- Insert: Karl Durrance (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recgDrrtXzx3TiHq2', 'Karl Durrance', NULL, 'https://www.linkedin.com/in/ACwAAACuXnIBXbSC6bh0Dep2jzwVgttBijAjH3k', 'Managing Director, Australia and New Zealand', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Stripe Capital launch news. Exciting move for local SMBs!', 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.', 'Hope you''re well Karl! I see you''re building out the Sydney team. How are you finding the local talent market? We''re noticing some interesting shifts around SDR hiring in Sydney, particularly with the fintech growth we''re seeing.', '2025-09-28T04:02:05.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recgDrrtXzx3TiHq2' 
       OR (LOWER(name) = LOWER('Karl Durrance') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACuXnIBXbSC6bh0Dep2jzwVgttBijAjH3k' )
);
-- Insert: Byron Rudenno (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recgRPalW4IyjJE0w', 'Byron Rudenno', NULL, 'https://www.linkedin.com/in/ACwAAABJOhgBMxDrdpWxAv5izPepCIiU_Fs7K_8', 'Senior Vice President, Europe & Asia-Pacific', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Sydney office expansion. Love the local growth!', 'We''re working with some excellent senior account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in competitive markets.', 'I see you''re building out your team. How are you finding the talent market for senior account management roles? We''re noticing some interesting shifts in the market, particularly around experienced sales hires in the research and advisory space. The demand for quality account managers who can navigate complex IT decision makers is really heating up.', '2025-09-25T04:51:22.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recgRPalW4IyjJE0w' 
       OR (LOWER(name) = LOWER('Byron Rudenno') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABJOhgBMxDrdpWxAv5izPepCIiU_Fs7K_8' )
);
-- Insert: Alex Gouramanis (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recgX28HvuMYc5yTR', 'Alex Gouramanis', NULL, 'https://www.linkedin.com/in/alexgouramanis', 'HEAD OF SALES – NEW ZEALAND & AUSTRALIA, SOUTHERN', 'Melbourne, Australia', 'messaged', NULL, 'LinkedIn Job Posts', NOW(), 'Saw the Fintech 2025+ report release. Great insights on cross-border payments trends.', 'We''re working with some strong SDR candidates in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the fintech talent market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in payments and fintech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recgX28HvuMYc5yTR' 
       OR (LOWER(name) = LOWER('Alex Gouramanis') OR linkedin_url = 'https://www.linkedin.com/in/alexgouramanis' )
);
-- Insert: Rob Dooley (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recgacB7bLBWjVBaL', 'Rob Dooley', NULL, 'https://www.linkedin.com/in/ACwAAABt-R8BUuDWf0oAmgRgwU5Lk-k0prtN7qI', 'Vice President and General Manager, Asia Pacific and Japan', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the Frost Radar Leader recognition for MDR. Congrats on that achievement!', 'We''re working with some experienced Sales Managers in cybersecurity at the moment. We''ve helped companies like HubSpot and Docusign with similar roles.', 'I see you''re building out your ANZ sales team. How are you finding the cybersecurity talent market? We''re noticing some interesting shifts, particularly around Sales Manager hires in enterprise security.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recgacB7bLBWjVBaL' 
       OR (LOWER(name) = LOWER('Rob Dooley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABt-R8BUuDWf0oAmgRgwU5Lk-k0prtN7qI' )
);
-- Insert: Reece Appleton (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recggP5zMVNdTeBht', 'Reece Appleton', NULL, 'https://www.linkedin.com/in/ACwAAAlXy-kBqk1aX_p0s-UMUsY7quPi-qHwpw8', 'Regional Director APAC', 'Greater Sydney Area, Australia', 'new', NULL, '', NULL, 'Saw Huntress hit the 10 year milestone. Congrats on the anniversary!', 'We''re working with some excellent AE candidates in cybersecurity at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the cybersecurity talent market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in security tech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recggP5zMVNdTeBht' 
       OR (LOWER(name) = LOWER('Reece Appleton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAlXy-kBqk1aX_p0s-UMUsY7quPi-qHwpw8' )
);
-- Insert: Zac Beeten (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recgm0zj33aB6URYn', 'Zac Beeten', NULL, 'https://www.linkedin.com/in/ACwAAAg5D5UBKwntZbqjUFJpOxGmaTBzjWI14SQ', 'Sales Director - ANZ', 'Greater Sydney Area', 'in queue', 'High', 'LinkedIn Job Posts', '2025-10-01T23:29:10.302Z', 'Saw the intelliHR rebrand to Humanforce HR. Smart move!', 'We''re working with some excellent Solutions Consultant candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their presales teams.', 'I see you''re building out your presales team. How are you finding the local talent market? We''re noticing some interesting shifts in the tech space, particularly around Solutions Consultant hires in Sydney. With all the growth happening at North Sydney HQ, I imagine you''re seeing strong demand for quality presales talent.', '2025-10-01T14:18:15.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recgm0zj33aB6URYn' 
       OR (LOWER(name) = LOWER('Zac Beeten') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAg5D5UBKwntZbqjUFJpOxGmaTBzjWI14SQ' )
);
-- Insert: Alex Belperio (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recgo7oV9FeErHNWS', 'Alex Belperio', NULL, 'https://www.linkedin.com/in/ACwAAARXVWwBQ_wPN3EdVkeIIDqb_2kiRGZ3sLU', 'Executive General Manager - Central Sales', 'Canberra, Australian Capital Territory, Australia', 'new', NULL, '', NULL, 'Saw the Blue Connections acquisition news. Congrats on the expansion!', 'We''re working with some excellent Sales Executive candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the sales talent market with all the growth happening at Atturra? We''re noticing some interesting shifts in the landscape, particularly around Sales Executive hires in the tech services space.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recgo7oV9FeErHNWS' 
       OR (LOWER(name) = LOWER('Alex Belperio') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAARXVWwBQ_wPN3EdVkeIIDqb_2kiRGZ3sLU' )
);
-- Insert: Evan Blennerhassett (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recgqASjS63A4ckfk', 'Evan Blennerhassett', NULL, 'https://www.linkedin.com/in/ACwAAABkkiABOgltupySzqicCjIJE3SvQCiNmSc', 'Regional Sales Manager - Enterprise & Government', 'Brisbane, Queensland, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love seeing 3Columns'' Growth Partner win. Strong Sydney momentum!', 'We''re working with some excellent public sector AEs at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their government teams.', 'I see you''re building out your public sector team. How are you finding the government talent market? We''re noticing some interesting shifts, particularly around Enterprise AE hires with security clearances in Sydney.', '2025-09-25T05:24:02.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recgqASjS63A4ckfk' 
       OR (LOWER(name) = LOWER('Evan Blennerhassett') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABkkiABOgltupySzqicCjIJE3SvQCiNmSc' )
);
-- Insert: Toni W. (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recgy0rIz6pMjaG3M', 'Toni W.', NULL, 'https://www.linkedin.com/in/ACwAACq66IkBHEcWBAzquJgCPhrrdQjOzg8M7-c', 'Sales Director - CX', 'Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Sydney Metro work. That''s huge infrastructure!', 'We''re working with some excellent enterprise sales candidates in the Sydney market at the moment. Companies like HubSpot and Docusign have found our approach helpful during their expansion phases.', 'I see you''re building out your APAC sales team. How are you finding the local talent market in Sydney? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales hires in construction tech.', '2025-09-28T03:51:29.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recgy0rIz6pMjaG3M' 
       OR (LOWER(name) = LOWER('Toni W.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACq66IkBHEcWBAzquJgCPhrrdQjOzg8M7-c' )
);
-- Insert: Franco Costa (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rech9ZrQ1hsAYgOol', 'Franco Costa', NULL, 'https://www.linkedin.com/in/ACwAAAPbIM0BOXJwaqZN9FoHwUTxsW8nukA6xyM', 'Solution Sales Director - Audit & Risk - APAC', 'Melbourne, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Diligent Connections event at the Australian Museum. That''s exciting!', 'We''re working with some excellent BDR candidates who have GRC experience at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.', 'Hope you''re well Franco! I see you''re building out your team at Diligent. How are you finding the Sydney talent market with all the activity around the Connections event? We''re noticing some interesting shifts in the market, particularly around BDR hires in the GRC space. The AI focus at your event aligns with what we''re seeing candidates get excited about.', '2025-09-20T06:37:02.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rech9ZrQ1hsAYgOol' 
       OR (LOWER(name) = LOWER('Franco Costa') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAPbIM0BOXJwaqZN9FoHwUTxsW8nukA6xyM' )
);
-- Insert: Gavin Altus (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rechFJHyFnZLatbwH', 'Gavin Altus', NULL, 'https://www.linkedin.com/in/ACwAAAH2Ks8B9CVgTV3otuMOf6tzXgPFX73ZSj0', 'Managing Director', 'Greater Melbourne Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw Sentrient''s focus on 2025 compliance changes. Smart positioning!', 'We''re working with some excellent AE candidates in the compliance space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Melbourne teams.', 'I see you''re building out your AE team. How are you finding the local talent market? We''re noticing some interesting shifts in the market, particularly around Account Executive hires in compliance and GRC software. With Sentrient''s growth to 600+ businesses, timing seems perfect for scaling the sales team.', '2025-09-23T14:25:17.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rechFJHyFnZLatbwH' 
       OR (LOWER(name) = LOWER('Gavin Altus') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAH2Ks8B9CVgTV3otuMOf6tzXgPFX73ZSj0' )
);
-- Insert: Peter Gregson (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rechKl6GBWUmp8BPM', 'Peter Gregson', NULL, 'https://www.linkedin.com/in/ACwAAAmxmKQBXgzHQV-kkVFIlKBlgALPkShT2w4', 'Sales Manager', 'Greater Melbourne Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the iPX Sydney event news. That''s exciting growth in the local market!', 'We''re working with some excellent AE candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.', 'I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts around Account Executive hires in the partnership space, particularly with companies scaling locally like Impact.', '2025-09-20T06:39:07.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rechKl6GBWUmp8BPM' 
       OR (LOWER(name) = LOWER('Peter Gregson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAmxmKQBXgzHQV-kkVFIlKBlgALPkShT2w4' )
);
-- Insert: Gautam Ahuja (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rechYvSzvc3ycpmjT', 'Gautam Ahuja', NULL, 'https://www.linkedin.com/in/gautam-ahuja-226279292', 'National Sales Director', 'Melbourne, Australia', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), 'Saw the Zeenea acquisition news. Smart move to strengthen the data analytics side.', 'Hope you''re well! We''re working with some strong Sales Director candidates in enterprise software. Happy to chat if useful.', 'I see you''re hiring a Sales Director at HCLSoftware. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rechYvSzvc3ycpmjT' 
       OR (LOWER(name) = LOWER('Gautam Ahuja') OR linkedin_url = 'https://www.linkedin.com/in/gautam-ahuja-226279292' )
);
-- Insert: Andrew McCarthy (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rechfkxIWm8kccy2q', 'Andrew McCarthy', NULL, 'https://www.linkedin.com/in/ACwAAAP2OIEBhvmsGs4CE-6xJ22XbVoQB91JuM8', 'GM of ANZ, SEA and India', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Sydney HQ launch! Love the local expansion.', 'We''re working with some excellent sales talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases like yours.', 'I see you''re scaling the team there. How are you finding the local talent market? We''re noticing some interesting shifts, particularly around sales hires in Sydney. With plans to double headcount, I imagine you''re seeing the competition firsthand.', '2025-09-25T01:28:49.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rechfkxIWm8kccy2q' 
       OR (LOWER(name) = LOWER('Andrew McCarthy') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAP2OIEBhvmsGs4CE-6xJ22XbVoQB91JuM8' )
);
-- Insert: Prakash Damoo (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recht35SReFcRf3bv', 'Prakash Damoo', NULL, 'https://www.linkedin.com/in/prakashdamoo', 'Product Enablement Lead', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the AI-powered Conversational Search launch. Love seeing the innovation at Squiz!', 'Hope you''re well! We''re working with some strong product marketing and enablement candidates at the moment. Happy to chat if useful.', 'I see you''re hiring a Senior Product Marketing and Sales Enablement Manager at Squiz. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recht35SReFcRf3bv' 
       OR (LOWER(name) = LOWER('Prakash Damoo') OR linkedin_url = 'https://www.linkedin.com/in/prakashdamoo' )
);
-- Insert: Budd Ilic (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reciBwHcefXFR8rE6', 'Budd Ilic', NULL, 'https://www.linkedin.com/in/ACwAAABjY0oBt7rwWfdC54shwh0MlU23V7AeGCQ', 'Regional Director, ANZ', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the Google acquisition news. That''s incredible!', 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during major growth phases.', 'I see you''re building out your team. How are you finding the enterprise sales market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in cybersecurity.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reciBwHcefXFR8rE6' 
       OR (LOWER(name) = LOWER('Budd Ilic') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABjY0oBt7rwWfdC54shwh0MlU23V7AeGCQ' )
);
-- Insert: Vicki Sayer (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reciE84GTYcHNiV9O', 'Vicki Sayer', NULL, 'https://www.linkedin.com/in/ACwAABcJOxwBpkwe7JfLjG8x4qlzvC9VvA_w_Wc', 'Professional Services Manager - Australia', 'Greater Melbourne Area, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the TrustRadius awards news. Congrats on the eight wins!', 'We''re working with some excellent Sales Executive candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Executive hires in software solutions.', '2025-09-17T14:20:46.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reciE84GTYcHNiV9O' 
       OR (LOWER(name) = LOWER('Vicki Sayer') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABcJOxwBpkwe7JfLjG8x4qlzvC9VvA_w_Wc' )
);
-- Insert: Martin Yan (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recikzeGhhzDbcBuy', 'Martin Yan', NULL, 'https://www.linkedin.com/in/martinyan', 'Head of Enterprise Solutions Sales - APAC & Japan', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw Atlassian hit $5.2B revenue. Incredible growth in enterprise!', 'Hope you''re well! We''re working with some strong partner sales candidates in the APAC region. Happy to chat if useful.', 'I see you''re hiring a Partner Sales Manager ANZ at Atlassian. How are you finding the market? We work with companies like HubSpot on similar partner roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recikzeGhhzDbcBuy' 
       OR (LOWER(name) = LOWER('Martin Yan') OR linkedin_url = 'https://www.linkedin.com/in/martinyan' )
);
-- Insert: Shaun Haque (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recim2nSBvZIkuQLf', 'Shaun Haque', NULL, 'https://www.linkedin.com/in/shaunhaque', 'Senior Sales Manager', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw Ordermentum hit $2 billion in transactions. That''s massive! Congrats on the milestone.', 'Hope you''re well! We''re working with some strong Sales Enablement candidates at the moment. Happy to chat if useful.', 'I see Ordermentum is hiring a Sales Enablement Manager. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recim2nSBvZIkuQLf' 
       OR (LOWER(name) = LOWER('Shaun Haque') OR linkedin_url = 'https://www.linkedin.com/in/shaunhaque' )
);
-- Insert: Vanessa Cause (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recin5eSOv7uqcyOG', 'Vanessa Cause', NULL, 'https://www.linkedin.com/in/ACwAAAswnPEB6abP0DKP2dVhBTtQw6p64qbLQjw', 'Sales Director APAC', 'Brisbane, Queensland, Australia', 'connection_requested', NULL, 'LinkedIn Job Posts', '2025-09-19T05:28:42.851Z', 'Saw the AI Product of the Year award news. Congrats on the win!', 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid growth phases.', 'I see you''re building out your team. How are you finding the automotive tech market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in AI companies.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recin5eSOv7uqcyOG' 
       OR (LOWER(name) = LOWER('Vanessa Cause') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAswnPEB6abP0DKP2dVhBTtQw6p64qbLQjw' )
);
-- Insert: Sam Symmans (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recivA3sbUbbu8tON', 'Sam Symmans', NULL, 'https://www.linkedin.com/in/ACwAABtC2LYBxzEo8yr9HI-CVjcGL41YR5apCsU', 'Sales Director, ANZ', 'Sydney, Australia', 'in queue', NULL, 'LinkedIn Job Posts', '2025-09-19T05:28:31.543Z', 'Saw the Google acquisition news. That''s huge - congrats on the $32B deal!', 'We''re working with some excellent Enterprise AEs in cybersecurity at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases.', 'I see you''re building out your team. How are you finding the cybersecurity talent market? We''re noticing some interesting shifts in the landscape, particularly around Enterprise AE hires in cloud security.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recivA3sbUbbu8tON' 
       OR (LOWER(name) = LOWER('Sam Symmans') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABtC2LYBxzEo8yr9HI-CVjcGL41YR5apCsU' )
);
-- Insert: Clint Elliott (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recixkHAC8cvSQXy0', 'Clint Elliott', NULL, 'https://www.linkedin.com/in/ACwAAATjWbIBcqRSeBGi4CTrVeLVt0wg7PSg0BI', 'Regional Sales Manager - Western Australia', 'Perth, Western Australia, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Great Place to Work recognition. Well deserved!', 'We''re working with some excellent strategic account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.', 'I see you''re building out your team. How are you finding the talent market around senior sales roles? We''re noticing some interesting shifts in the market, particularly around strategic account manager hires in the tech space.', '2025-09-25T05:13:11.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recixkHAC8cvSQXy0' 
       OR (LOWER(name) = LOWER('Clint Elliott') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATjWbIBcqRSeBGi4CTrVeLVt0wg7PSg0BI' )
);
-- Insert: Ryan Alexander (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reciy2Kv84AHdmjZa', 'Ryan Alexander', NULL, 'https://www.linkedin.com/in/ACwAAAFOtaMBTxx1xHv5t0vDvnKSDMC-V84fqGw', 'Head of Sales, Australia', 'Sydney, New South Wales, Australia', 'messaged', 'High', 'LinkedIn Job Posts', '2025-09-29T01:07:14.989Z', 'Saw the March Work Innovation Summit. Love the local focus!', 'We''re working with some excellent BDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.', 'I see Asana''s continuing to build out the Sydney team. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around BDR hires in the collaboration space. The summit looked like a great way to connect with local leaders.', '2025-09-28T03:53:28.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reciy2Kv84AHdmjZa' 
       OR (LOWER(name) = LOWER('Ryan Alexander') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFOtaMBTxx1xHv5t0vDvnKSDMC-V84fqGw' )
);
-- Insert: Penny Dolton (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recizcGBMuqNpULyj', 'Penny Dolton', NULL, 'https://www.linkedin.com/in/ACwAABQhvCMBfPI1DZKch-OWcdQdizG_PhnAfiY', 'Pacific Sales Director - CostX', 'Brisbane, Queensland, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Sydney Metro and WestConnex wins. Impressive local growth!', 'We''re working with some excellent enterprise sales candidates in the construction tech space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC sales operations.', 'I see you''re building out your APAC sales team. How are you finding the market for senior sales talent across the region? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales hires in construction tech. The demand for digitisation expertise seems to be driving some unique hiring challenges.', '2025-09-28T03:51:30.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recizcGBMuqNpULyj' 
       OR (LOWER(name) = LOWER('Penny Dolton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABQhvCMBfPI1DZKch-OWcdQdizG_PhnAfiY' )
);
-- Insert: Marco D. Castelán (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recj74ToRqf8ByLuI', 'Marco D. Castelán', NULL, 'https://www.linkedin.com/in/ACwAAAlYnbYBeNCdo3-hfYch3V1Lm2GAfBy9NYE', 'Director - APAC Sales', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the G2 award news. Congrats on being #1 IT Infrastructure Software!', 'We''re working with some experienced Sales Managers at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your sales team. How are you finding the market with all the international expansion happening? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Manager hires in SaaS.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recj74ToRqf8ByLuI' 
       OR (LOWER(name) = LOWER('Marco D. Castelán') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAlYnbYBeNCdo3-hfYch3V1Lm2GAfBy9NYE' )
);
-- Insert: Julian Lock (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recjGNatiZBvN0Rpj', 'Julian Lock', NULL, 'https://www.linkedin.com/in/ACwAAAEwvkQBLlxtnjb21fPWmyLZs0tTGTTsEEc', 'Senior Sales Director - APAC', 'Greater Brisbane Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love that Info-Tech''s Sydney office is the APAC hub. Smart positioning!', 'We''re working with some excellent account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when expanding their regional teams.', 'I see you''re building out your team. How are you finding the talent market across the region? We''re noticing some interesting shifts around account management hires in APAC, particularly with companies scaling their advisory services.', '2025-09-25T03:27:03.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recjGNatiZBvN0Rpj' 
       OR (LOWER(name) = LOWER('Julian Lock') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEwvkQBLlxtnjb21fPWmyLZs0tTGTTsEEc' )
);
-- Insert: Matthew Tyrrell (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recjIsZ0dg1FWmaI2', 'Matthew Tyrrell', NULL, 'https://www.linkedin.com/in/ACwAAACxYdABEDFKVJ_3G6aUhQ9mdwGC1N1lLHM', 'Sales Director, ANZ', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the $152M funding news. Congrats on the round!', 'We''re working with some strong Enterprise Sales candidates in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your team. How are you finding the fintech talent market? We''re noticing some interesting shifts, particularly around Enterprise Sales hires in treasury management.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recjIsZ0dg1FWmaI2' 
       OR (LOWER(name) = LOWER('Matthew Tyrrell') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACxYdABEDFKVJ_3G6aUhQ9mdwGC1N1lLHM' )
);
-- Insert: Luke Kavanagh (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recjOkzIweR9qaiII', 'Luke Kavanagh', NULL, 'https://www.linkedin.com/in/ACwAABvENSEBSnBFLbw3LUBx-G1Xlp1u6Ewlfes', 'National Sales Manager', 'Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Congrats on the Great Place to Work recognition! Well deserved.', 'We''re working with some excellent strategic account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise sales teams.', 'I see you''re building out your team. How are you finding the Sydney market for strategic account roles? We''re noticing some interesting shifts in the talent landscape, particularly around senior sales hires in IT services. The demand for experienced account managers who can navigate complex enterprise deals has really picked up.', '2025-09-25T05:13:11.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recjOkzIweR9qaiII' 
       OR (LOWER(name) = LOWER('Luke Kavanagh') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABvENSEBSnBFLbw3LUBx-G1Xlp1u6Ewlfes' )
);
-- Insert: Jackson Duffy (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recjY4KLAMMr8HGFS', 'Jackson Duffy', NULL, 'https://www.linkedin.com/in/ACwAAB-U4eEBYicTIC6uh0BFjw4pgqgZUHZ6esI', 'Head of Partnerships', 'Sydney, New South Wales, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the AU/NZ Shopify app launch. Great move for the local market!', 'We''re working with some excellent Customer Success candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their CS teams.', 'I see you''re building out your customer success team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Customer Success Manager hires in logistics tech. The demand for people who understand both the technical side and client relationship management has really picked up since more companies are focusing on retention and expansion.', '2025-10-01T14:24:01.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recjY4KLAMMr8HGFS' 
       OR (LOWER(name) = LOWER('Jackson Duffy') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAB-U4eEBYicTIC6uh0BFjw4pgqgZUHZ6esI' )
);
-- Insert: Hayley Fisher (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recjZD38O6vAaz5Y2', 'Hayley Fisher', NULL, 'https://www.linkedin.com/in/ACwAAAChh5IB6b2s_eEXnNb3VomBlbDxgWQ6k30', 'Adyen Country Manager - Australia & New Zealand', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Reece partnership news. That''s a huge win for the ANZ market!', 'We''re working with some excellent Account Manager candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases like yours with the Reece rollout.', 'I see you''re building out your team. How are you finding the local talent market after the Reece partnership? We''re noticing some interesting shifts in the market, particularly around Account Manager hires in payments. With 600 stores rolling out, I imagine you''re scaling fast. Would love to chat about what we''re seeing in the market.', '2025-09-21T14:17:49.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recjZD38O6vAaz5Y2' 
       OR (LOWER(name) = LOWER('Hayley Fisher') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAChh5IB6b2s_eEXnNb3VomBlbDxgWQ6k30' )
);
-- Insert: Amanda Kidd (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recjZfpd7n63Bgw0I', 'Amanda Kidd', NULL, 'https://www.linkedin.com/in/ACwAAAOTOs0B1__1QRYZTg9OvtyYx82Oshtxbh0', 'Sales Operations Manager', 'Greater Sydney Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Silverwater operation. Love the Sydney distribution focus!', 'We''re working with some excellent strategic account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.', 'I see you''re building out your team with the National Strategic Account Manager role. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the market, particularly around strategic account hires in IT distribution.', '2025-09-25T01:34:03.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recjZfpd7n63Bgw0I' 
       OR (LOWER(name) = LOWER('Amanda Kidd') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOTOs0B1__1QRYZTg9OvtyYx82Oshtxbh0' )
);
-- Insert: Alexander G. (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recjpf1oZQVPxOotT', 'Alexander G.', NULL, 'https://www.linkedin.com/in/alexanderjgreen', 'General Manager', 'Greensborough, Australia', 'new', NULL, '', NULL, 'Great to connect Alexander! Love seeing the growth at E1 across the APAC region.', 'We''re working with some excellent AE candidates across enterprise software.', 'I see you''re building out your team for E1. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in enterprise software.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recjpf1oZQVPxOotT' 
       OR (LOWER(name) = LOWER('Alexander G.') OR linkedin_url = 'https://www.linkedin.com/in/alexanderjgreen' )
);
-- Insert: Luke Kavanagh (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recjvnDJ55oJcRFvR', 'Luke Kavanagh', NULL, 'https://www.linkedin.com/in/ACwAABvENSEBSnBFLbw3LUBx-G1Xlp1u6Ewlfes', 'National Sales Manager', 'Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the Silverwater operations hub. Great Sydney presence!', 'We''re working with some excellent strategic account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise sales teams.', 'I see you''re building out your strategic accounts team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent landscape, particularly around strategic account manager hires in the IT services space.', '2025-09-25T01:34:02.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recjvnDJ55oJcRFvR' 
       OR (LOWER(name) = LOWER('Luke Kavanagh') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABvENSEBSnBFLbw3LUBx-G1Xlp1u6Ewlfes' )
);
-- Insert: Simon Robinson (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recjyWvxnGmGGTDu0', 'Simon Robinson', NULL, 'https://www.linkedin.com/in/simonrobinson1974', 'Growth & Operations', 'Sydney, Australia', 'new', NULL, '', NULL, 'Great to connect Simon! Love seeing growth and operations leaders driving strategic initiatives forward.', 'We''re working with some excellent Sales Director candidates across enterprise software.', 'I see you''re building out your team for Think & Grow. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in enterprise software.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recjyWvxnGmGGTDu0' 
       OR (LOWER(name) = LOWER('Simon Robinson') OR linkedin_url = 'https://www.linkedin.com/in/simonrobinson1974' )
);
-- Insert: Danielle Langley (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reck36OfCvKCGKHpo', 'Danielle Langley', NULL, 'https://www.linkedin.com/in/ACwAAAFTm9QBAEDhSFTBVl7GdgQvLFHmRqlx508', 'Sales Manager', 'Greater Perth Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the news about Christopher Smith joining as APAC MD. Exciting times ahead for Civica!', 'We''re working with some excellent AE candidates with local government experience. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the market for local government AEs? We''re noticing some interesting shifts in the talent landscape, particularly around public sector sales hires with the APAC expansion happening.', '2025-09-18T21:02:49.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reck36OfCvKCGKHpo' 
       OR (LOWER(name) = LOWER('Danielle Langley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFTm9QBAEDhSFTBVl7GdgQvLFHmRqlx508' )
);
-- Insert: Damian Wrigley (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reckJX8bzwIfnfj1U', 'Damian Wrigley', NULL, 'https://www.linkedin.com/in/ACwAAALBzWoBh0bvRZ3l3aNQ-nM5VdzBqiEMYeA', 'Senior Sales Manager Australia, JustCo', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the enterprise push across your Sydney locations. That''s exciting!', 'We''re working with some excellent sales candidates in the coworking space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.', 'I see you''re building out your sales team. How are you finding the local talent market? We''re noticing some interesting shifts around sales hires in the flexible workspace space, particularly with companies scaling their enterprise solutions in Sydney.', '2025-09-25T04:46:17.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reckJX8bzwIfnfj1U' 
       OR (LOWER(name) = LOWER('Damian Wrigley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAALBzWoBh0bvRZ3l3aNQ-nM5VdzBqiEMYeA' )
);
-- Insert: Ashley Carron-Arthur (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reckMAhhcEYfHkClb', 'Ashley Carron-Arthur', NULL, 'https://www.linkedin.com/in/ACwAAAW0bdgB9kKGArhyUcp9phFh9UEKcmZLPKE', 'Enterprise Account Executive, APAC', 'Greater Sydney Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Congrats on the Sydney HQ launch. Great local momentum!', 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases like yours.', 'I see you''re building out the APAC sales team. How are you finding the local talent market with plans to double headcount? We''re noticing some interesting shifts in the market, particularly around enterprise sales hires in productivity software.', '2025-09-25T01:28:50.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reckMAhhcEYfHkClb' 
       OR (LOWER(name) = LOWER('Ashley Carron-Arthur') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAW0bdgB9kKGArhyUcp9phFh9UEKcmZLPKE' )
);
-- Insert: Allison Watts (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recktK08M6soM75dN', 'Allison Watts', NULL, 'https://www.linkedin.com/in/allisonwatts', 'Director of Sales - Workday Practice', 'Australia', 'new', NULL, '', NULL, 'Saw the Q2 results news. Congrats on the strong performance!', 'We''re working with some strong candidates in the TMT consulting space.', 'I see you''re hiring for the TMT Service Line Specialist role at Cognizant. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recktK08M6soM75dN' 
       OR (LOWER(name) = LOWER('Allison Watts') OR linkedin_url = 'https://www.linkedin.com/in/allisonwatts' )
);
-- Insert: Renee Rooney (LEAD LOST)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reckud9kvrccGNCU1', 'Renee Rooney', NULL, 'https://www.linkedin.com/in/renee-rooney-67b779115', 'Head of Customer Success', 'Gold Coast, Australia', 'lead_lost', NULL, 'LinkedIn Job Posts', NOW(), 'Saw the new cloud platform launch. Love seeing the multi-tenant approach for enterprise customers.', 'We''re working with some experienced Sales Managers in cybersecurity at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re hiring a Regional Sales Manager in Canberra. How are you finding the cybersecurity talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Manager hires in enterprise security.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reckud9kvrccGNCU1' 
       OR (LOWER(name) = LOWER('Renee Rooney') OR linkedin_url = 'https://www.linkedin.com/in/renee-rooney-67b779115' )
);
-- Insert: Anthony Read (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recl8hsdy1FFKNLsW', 'Anthony Read', NULL, 'https://www.linkedin.com/in/anthony-read-a2a244133', 'Vice President Aerospace & Defence APJMEA', 'Melbourne, Australia', 'new', NULL, '', NULL, 'Love seeing IFS winning Rolls-Royce Power Systems. Great work in aerospace!', 'Hope you''re well! We''re working with some strong presales candidates in the AI space. Happy to chat if useful.', 'I see you''re hiring a Presales Consultant for AI Growth at IFS. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recl8hsdy1FFKNLsW' 
       OR (LOWER(name) = LOWER('Anthony Read') OR linkedin_url = 'https://www.linkedin.com/in/anthony-read-a2a244133' )
);
-- Insert: Srikanth Mohan (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reclCcLVWujz8SLOW', 'Srikanth Mohan', NULL, 'https://www.linkedin.com/in/srikanth-mohan-0bb5318', 'Ecosystem Sales Director - Hybrid Integration and iPaaS for Australia & NZ market', 'Sydney, Australia', 'new', NULL, '', NULL, 'Love seeing IBM''s focus on expanding the channel partner network. Great timing with all the AI growth.', 'Hope you''re well! We''re working with some strong sales specialists in the automation space at the moment. Happy to chat if useful.', 'I see you''re hiring a Brand Sales Specialist for the automation platform. How''s the search going? We work with companies like Hubspot on similar sales roles across ANZ.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reclCcLVWujz8SLOW' 
       OR (LOWER(name) = LOWER('Srikanth Mohan') OR linkedin_url = 'https://www.linkedin.com/in/srikanth-mohan-0bb5318' )
);
-- Insert: Geoffrey Andrews (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reclI9ZXrkMVksTPl', 'Geoffrey Andrews', NULL, 'https://www.linkedin.com/in/geoffreyandrews', 'Sales Director - APAC', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the Broadcom partnership news. Great move for Canonical!', 'Hope you''re well! We''re working with some strong partner sales candidates in the ANZ region. Happy to chat if useful.', 'I see you''re hiring a Partner Sales Executive for ANZ. How are you finding the market? We work with companies like HubSpot on similar partner sales roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reclI9ZXrkMVksTPl' 
       OR (LOWER(name) = LOWER('Geoffrey Andrews') OR linkedin_url = 'https://www.linkedin.com/in/geoffreyandrews' )
);
-- Insert: Michael Clarke (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reclJiss1NlzW0wP9', 'Michael Clarke', NULL, 'https://www.linkedin.com/in/ACwAAANeKMIBAghOM7EsWC2KHNpJuac7-LEj4iU', 'General Manager AU/NZ', 'Greater Brisbane Area', 'new', NULL, '', NULL, 'Saw the AI Product of the Year award news. Congrats!', 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in automotive tech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reclJiss1NlzW0wP9' 
       OR (LOWER(name) = LOWER('Michael Clarke') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAANeKMIBAghOM7EsWC2KHNpJuac7-LEj4iU' )
);
-- Insert: Elizabeth Watson (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reclKJn3g48XcTaXA', 'Elizabeth Watson', NULL, 'https://www.linkedin.com/in/elizabeth-watson-0817163', 'Chief Delivery Officer', 'Sydney, Australia', 'new', NULL, '', NULL, 'Love seeing the platform upgrades and doubled partner network at Squiz. Great year for growth!', 'Hope you''re well! We''re working with some strong product marketing and enablement candidates at the moment. Happy to chat if useful.', 'I see you''re hiring a Product Marketing and Sales Enablement Manager at Squiz. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reclKJn3g48XcTaXA' 
       OR (LOWER(name) = LOWER('Elizabeth Watson') OR linkedin_url = 'https://www.linkedin.com/in/elizabeth-watson-0817163' )
);
-- Insert: Lawrence Du (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reclMU0UyT2JMuEtc', 'Lawrence Du', NULL, 'https://www.linkedin.com/in/lawrencedu', 'SDR Manager | Simplifying IT Management | NinjaOne', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the Forbes Cloud 100 news. Congrats on the recognition!', 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your SDR team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in IT management and SaaS.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reclMU0UyT2JMuEtc' 
       OR (LOWER(name) = LOWER('Lawrence Du') OR linkedin_url = 'https://www.linkedin.com/in/lawrencedu' )
);
-- Insert: Laura Lane (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recleGE0Fu1oEFrVU', 'Laura Lane', NULL, 'https://www.linkedin.com/in/ACwAAA60TEUBtHEGo8MSRgRlqw4GER1hdQ6GDio', 'Head of Sales, ANZ', 'Singapore', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Congrats on hitting $250M ARR from Sydney HQ!', 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during these rapid growth phases.', 'I see you''re building out your team with all the new roles being posted. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around sales development hires in Sydney. The growth you''re seeing must be creating some exciting opportunities but also some real challenges in finding the right people quickly.', '2025-09-28T03:59:34.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recleGE0Fu1oEFrVU' 
       OR (LOWER(name) = LOWER('Laura Lane') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA60TEUBtHEGo8MSRgRlqw4GER1hdQ6GDio' )
);
-- Insert: Rayna K. McNamara (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reclfLlKEtVaxh7DO', 'Rayna K. McNamara', NULL, 'https://www.linkedin.com/in/rkmcnamara', 'Senior Sales Manager', 'Queenscliff, Australia', 'new', NULL, '', NULL, 'Love seeing the Anthropic investment news. That''s a massive move for Amazon!', 'Hope you''re well! We''re working with some strong Account Manager candidates at the moment. Happy to chat if useful.', 'I see you''re hiring Account Managers at Amazon. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reclfLlKEtVaxh7DO' 
       OR (LOWER(name) = LOWER('Rayna K. McNamara') OR linkedin_url = 'https://www.linkedin.com/in/rkmcnamara' )
);
-- Insert: Johanes Iskandar (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reclgKGTLBH63pZx2', 'Johanes Iskandar', NULL, 'https://www.linkedin.com/in/ACwAAAFsm_MB8ey7pT_xGIqT5m13Pmp-bQAxuz0', 'Regional Vice President of Sales', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love seeing SUGCON ANZ 2025 coming to Sydney!', 'We''re working with some excellent SDR candidates focused on new business development at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their ANZ teams.', 'I see you''re building out your SDR team for ANZ new business. How are you finding the talent market across the region? We''re noticing some interesting shifts around SDR hiring in the tech space, particularly with companies expanding their ANZ presence.', '2025-10-01T14:15:43.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reclgKGTLBH63pZx2' 
       OR (LOWER(name) = LOWER('Johanes Iskandar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFsm_MB8ey7pT_xGIqT5m13Pmp-bQAxuz0' )
);
-- Insert: Charlotte Buxton (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recljpxKJLmaLtkQq', 'Charlotte Buxton', NULL, 'https://www.linkedin.com/in/ACwAAAtZsYgBHap28_PCkeYpoWUf5Cn2X9W7PlE', 'Enterprise Sales Manager', 'Melbourne, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the Sydney CBD growth across King Street and Pitt Street locations!', 'We''re working with some excellent sales executive candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in competitive markets.', 'I see you''re building out your sales team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent space, particularly around sales executive hires in the coworking sector. With JustCo''s expansion across multiple CBD locations, I imagine you''re seeing strong demand for experienced sales professionals who understand flexible workspace solutions.', '2025-09-25T05:08:33.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recljpxKJLmaLtkQq' 
       OR (LOWER(name) = LOWER('Charlotte Buxton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAtZsYgBHap28_PCkeYpoWUf5Cn2X9W7PlE' )
);
-- Insert: Steve Smith (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reclmPIOukbHtwkf5', 'Steve Smith', NULL, 'https://www.linkedin.com/in/ACwAAAE2xnwBHqukdddvJW7wTNR9yihRbJft-1o', 'Executive Director – Education (APAC)', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the news about Christopher Smith joining as APAC MD. Great move for the expansion.', 'We''re working with some excellent local government AEs at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.', 'I see you''re building out your team. How are you finding the local government market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in the public sector.', '2025-09-18T21:02:48.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reclmPIOukbHtwkf5' 
       OR (LOWER(name) = LOWER('Steve Smith') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAE2xnwBHqukdddvJW7wTNR9yihRbJft-1o' )
);
-- Insert: Avinash Kalyana Sundaram (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reclnuDGNYZXqPLQj', 'Avinash Kalyana Sundaram', NULL, 'https://www.linkedin.com/in/avinashkalyanasundaram', 'Manager Client Success APAC', 'Australia', 'new', NULL, '', NULL, 'Saw the Fosway 9-Grid recognition. Congrats on the Core Leader status!', 'We''re working with some excellent Enterprise Sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your Enterprise Sales team. How are you finding the learning tech market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in SaaS.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reclnuDGNYZXqPLQj' 
       OR (LOWER(name) = LOWER('Avinash Kalyana Sundaram') OR linkedin_url = 'https://www.linkedin.com/in/avinashkalyanasundaram' )
);
-- Insert: Nathan Archie (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reclsqkVNYVsbdAEJ', 'Nathan Archie', NULL, 'https://www.linkedin.com/in/ACwAAACt8skBOZUBu0dTQWpNwll9YGGfCJAxFQk', 'GM US & ANZ', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Shadow AI Report. Great insights on Sydney tech risks!', 'We''re working with some excellent AE candidates in the security space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams during growth phases.', 'I see you''re building out your AE team. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around enterprise sales hires in the cybersecurity space. The timing with your Shadow AI Report really highlights how much demand there is for security expertise right now.', '2025-09-29T14:24:49.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reclsqkVNYVsbdAEJ' 
       OR (LOWER(name) = LOWER('Nathan Archie') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACt8skBOZUBu0dTQWpNwll9YGGfCJAxFQk' )
);
-- Insert: Francis McGahan (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reclvFVCbtiLEgbBN', 'Francis McGahan', NULL, 'https://www.linkedin.com/in/ACwAAAmGghgBAi-x_YW7TBfbqQdhQXlDL-uqnuk', 'Senior Business Development Manager', 'Greater Melbourne Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love seeing the Victorian client wins. NDIS space is moving fast!', 'We''re working with some excellent BDR candidates with care sector experience at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.', 'I see you''re building out your BDR team. How are you finding the market for sales talent in the care management space? We''re noticing some interesting shifts in the talent landscape, particularly around BDR hires who understand the NDIS and aged care sectors. The regulatory knowledge piece seems to be becoming more important.', '2025-09-23T14:28:28.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reclvFVCbtiLEgbBN' 
       OR (LOWER(name) = LOWER('Francis McGahan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAmGghgBAi-x_YW7TBfbqQdhQXlDL-uqnuk' )
);
-- Insert: Whitney Liu (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recm8YD3tBWLgsTdU', 'Whitney Liu', NULL, 'https://www.linkedin.com/in/ACwAAAKWOWsBCR8GNYEhWDEIIoBWXoh-dIEWvq8', 'Sales Director - Pacific', 'Australia', 'connection_requested', NULL, 'LinkedIn Job Posts', '2025-09-19T05:28:37.309Z', 'Saw the Emerson merger news. That''s exciting for AspenTech!', 'We''re working with some excellent AE candidates with industrial software experience. Companies like HubSpot and Docusign have found our approach helpful during growth phases.', 'I see you''re building out your team. How are you finding the industrial tech talent market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in Melbourne''s tech sector.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recm8YD3tBWLgsTdU' 
       OR (LOWER(name) = LOWER('Whitney Liu') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKWOWsBCR8GNYEhWDEIIoBWXoh-dIEWvq8' )
);
-- Insert: Anthony Harding (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recmF5nGQLfdG4RXc', 'Anthony Harding', NULL, 'https://www.linkedin.com/in/ACwAAALJM9EBwayAkUKsPSNP0Vf8S-g5a8kJ-Jo', 'Head of Sales', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the AU/NZ Shopify app launch. That''s exciting timing with the growth!', 'We''re working with some excellent Customer Success candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your Customer Success team. How are you finding the talent market in Sydney? We''re noticing some interesting shifts around CS hires in logistics tech, particularly with companies scaling their e-commerce integrations.', '2025-10-01T14:24:00.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recmF5nGQLfdG4RXc' 
       OR (LOWER(name) = LOWER('Anthony Harding') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAALJM9EBwayAkUKsPSNP0Vf8S-g5a8kJ-Jo' )
);
-- Insert: Lara Horne (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recmGayu5dUZYTmVe', 'Lara Horne', NULL, 'https://www.linkedin.com/in/ACwAAADPv2MBIHAKcCXc3fSFN9Yck-NJ6fpMVfc', 'Head of Sales', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Reece partnership news. That''s a massive win for the ANZ market!', 'We''re working with some excellent Account Manager candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during these scaling phases.', 'Hope you''re well! I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Manager hires in payments, particularly with all the growth happening in the sector right now.', '2025-09-21T14:17:50.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recmGayu5dUZYTmVe' 
       OR (LOWER(name) = LOWER('Lara Horne') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADPv2MBIHAKcCXc3fSFN9Yck-NJ6fpMVfc' )
);
-- Insert: Paul Lancaster (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recmQzEqDP3gZhtZj', 'Paul Lancaster', NULL, 'https://www.linkedin.com/in/ACwAAAGWWpABv7fX58S-LxILR12NxW5aH1_mBcQ', 'Director Sales Engineering', 'Greater Sydney Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the ANZ data readiness report. Great insights on cyber resilience!', 'We''re working with some excellent Strategic AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.', 'I see you''re building out your team. How are you finding the market across the region? We''re noticing some interesting shifts in the talent market, particularly around Strategic AE hires in data security. The demand for enterprise sales professionals who understand cyber resilience has really picked up since that report came out.', '2025-09-28T14:34:57.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recmQzEqDP3gZhtZj' 
       OR (LOWER(name) = LOWER('Paul Lancaster') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAGWWpABv7fX58S-LxILR12NxW5aH1_mBcQ' )
);
-- Insert: Amy Zhang (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recn9wAQ9K8bZ6WSm', 'Amy Zhang', NULL, 'https://www.linkedin.com/in/ACwAAAYrHPsBGdLU3yWdbqidfTNveRScmdDx6YY', 'Head of APAC', 'Singapore', 'messaged', 'High', 'LinkedIn Job Posts', '2025-09-21T23:23:46.966Z', 'Saw the CloudTech partnership news. Love the Melbourne momentum!', 'We''re working with some excellent Sales Director candidates in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams locally.', 'I see you''re building out your sales team in Victoria. How are you finding the local talent market? We''re noticing some interesting shifts around senior sales hires in fintech, particularly with all the digital asset expansion happening in Melbourne.', '2025-09-21T14:10:16.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recn9wAQ9K8bZ6WSm' 
       OR (LOWER(name) = LOWER('Amy Zhang') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAYrHPsBGdLU3yWdbqidfTNveRScmdDx6YY' )
);
-- Insert: Kristin Carville (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recnPnJONpifitt13', 'Kristin Carville', NULL, 'https://www.linkedin.com/in/kristin-carville-75b67439', 'Sales Director ANZ', 'Sydney, Australia', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), 'Congrats on the five HotelTechAwards wins! That''s fantastic recognition for the team.', 'We''re working with some excellent Sales Director candidates across SaaS if you''re looking externally.', 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in SaaS.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recnPnJONpifitt13' 
       OR (LOWER(name) = LOWER('Kristin Carville') OR linkedin_url = 'https://www.linkedin.com/in/kristin-carville-75b67439' )
);
-- Insert: Carlos Bravo (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recnVGTKtSM0aiZiI', 'Carlos Bravo', NULL, 'https://www.linkedin.com/in/1carlosbravo', 'Head of Sales- ANZ', 'Melbourne, Australia', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), 'Saw the Agentforce partnership news. Love seeing Simplus leading the AI transformation space.', 'We''re working with some strong Presales candidates in the Salesforce space. Happy to chat if useful.', 'I see you''re hiring a Presales Executive at Simplus. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recnVGTKtSM0aiZiI' 
       OR (LOWER(name) = LOWER('Carlos Bravo') OR linkedin_url = 'https://www.linkedin.com/in/1carlosbravo' )
);
-- Insert: Stephanie May (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recngLCkjBMrNRpUN', 'Stephanie May', NULL, 'https://www.linkedin.com/in/stephaniejmay', 'Merchant Success Manager', 'Ballina, Australia', 'new', NULL, '', NULL, 'Saw the $200M funding news. Congrats on hitting unicorn status!', 'We''re working with some excellent BDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around BDR hires in logistics and fulfillment.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recngLCkjBMrNRpUN' 
       OR (LOWER(name) = LOWER('Stephanie May') OR linkedin_url = 'https://www.linkedin.com/in/stephaniejmay' )
);
-- Insert: Adam Maine (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recnhGB1PcBzGZVOc', 'Adam Maine', NULL, 'https://www.linkedin.com/in/ACwAAAJwrrABLmGhjluE_TVDochkNzu69dgCrRw', 'Regional Vice President - Australia & NZ', 'Sydney, Australia', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-19T05:28:39.280Z', 'Saw the platform upgrade news. Love the AI features you''ve added.', 'We''re working with some strong Senior Enterprise AEs at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your enterprise team. How are you finding the market for Senior AEs? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales hires in the analytics space.', '2025-09-17T14:19:37.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recnhGB1PcBzGZVOc' 
       OR (LOWER(name) = LOWER('Adam Maine') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAJwrrABLmGhjluE_TVDochkNzu69dgCrRw' )
);
-- Insert: Arran Mulvaney (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recnjSBDdcSUaeRFY', 'Arran Mulvaney', NULL, 'https://www.linkedin.com/in/ACwAAA1tgBYBgCPCkhWuHwV7M6hQa9nArWkksa0', 'Regional Director - ASEAN & India', 'Singapore, Singapore', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the Melbourne office expansion. Great local growth!', 'We''re working with some excellent AE candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful during local expansion phases.', 'I see you''re building out the team locally. How are you finding the Melbourne talent market? We''re noticing some interesting shifts around mid-market AE hires, particularly in the privacy and compliance space.', '2025-09-22T14:27:19.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recnjSBDdcSUaeRFY' 
       OR (LOWER(name) = LOWER('Arran Mulvaney') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA1tgBYBgCPCkhWuHwV7M6hQa9nArWkksa0' )
);
-- Insert: Steve Bray (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recns3yCbnYa9osEQ', 'Steve Bray', NULL, 'https://www.linkedin.com/in/ACwAAAHP9jQB2bkW1oHFixi1wXIgO1dESQBnKms', 'Vice President - Australia & New Zealand', 'Greater Melbourne Area, Australia', 'new', NULL, '', NULL, 'Saw the Security Today award news for History Player Search. Congrats on the win!', 'We''re working with some strong Enterprise Development Reps in security at the moment. We''ve helped HubSpot and Docusign with similar enterprise sales roles.', 'I see you''re building out your enterprise team. How are you finding the security talent market in Sydney? We''re noticing some interesting shifts in the landscape, particularly around Enterprise Development Rep hires in the security space.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recns3yCbnYa9osEQ' 
       OR (LOWER(name) = LOWER('Steve Bray') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAHP9jQB2bkW1oHFixi1wXIgO1dESQBnKms' )
);
-- Insert: Jacob Sinnott (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reco0fBm5GNOyl9RS', 'Jacob Sinnott', NULL, 'https://www.linkedin.com/in/ACwAABysF_MBgBu8JsLc3Ia1iH68N_H_9z-Ed1k', 'Australia Sales Manager – Hotels, Resorts & Apartments', 'Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the rebrand news for RMS. Love the new direction focusing on connection.', 'We''re working with some strong SDR candidates in hospitality tech at the moment. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your team. How are you finding the hospitality tech market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in the sector.', '2025-09-17T14:22:38.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reco0fBm5GNOyl9RS' 
       OR (LOWER(name) = LOWER('Jacob Sinnott') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABysF_MBgBu8JsLc3Ia1iH68N_H_9z-Ed1k' )
);
-- Insert: Leanne Mackenzie (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recoHC30aDPoyfOGk', 'Leanne Mackenzie', NULL, 'https://www.linkedin.com/in/leanne-mackenzie-396b66a8', 'Senior Sales Account Manager', 'Sydney, Australia', 'new', NULL, '', NULL, 'Congrats on the strategic partnerships with Riyadh Air and LIFT! That''s fantastic news.', 'We''re working with some excellent Account Manager candidates across enterprise software if you''re looking externally.', 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Manager hires in enterprise software.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recoHC30aDPoyfOGk' 
       OR (LOWER(name) = LOWER('Leanne Mackenzie') OR linkedin_url = 'https://www.linkedin.com/in/leanne-mackenzie-396b66a8' )
);
-- Insert: Winnie Nguyen (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recoO2NpaxZnI2m5W', 'Winnie Nguyen', NULL, 'https://www.linkedin.com/in/winnie-nguyen-94144a67', 'Strategic Sales Leader - Intelligent Operations', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the Turbonomic advancements news. Love seeing IBM''s continued innovation in intelligent operations.', 'Hope you''re well! We''re working with some strong sales specialists in the automation and AI space. Happy to chat if useful.', 'I see you''re hiring a Brand Sales Specialist for the automation platform. How''s the search going? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recoO2NpaxZnI2m5W' 
       OR (LOWER(name) = LOWER('Winnie Nguyen') OR linkedin_url = 'https://www.linkedin.com/in/winnie-nguyen-94144a67' )
);
-- Insert: Kane Lu (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recoT51ICsiKcDOOf', 'Kane Lu', NULL, 'https://www.linkedin.com/in/ACwAABpBNk0BymOf_bbIhKMxdDCG-wDwOtjW53s', 'VP of Enterprise Sales (Platforms & Embedded Financial Services Specialist)', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Reece partnership news. That''s a huge win for the ANZ market!', 'We''re working with some excellent Account Manager candidates with strong fintech backgrounds at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their commercial teams in this market.', 'Hope you''re well Kane! I see you''re scaling the account management team. How are you finding the local talent market? We''re noticing some interesting shifts in the fintech space, particularly around Account Manager hires with payments experience. The Reece partnership must be creating some exciting opportunities for the team.', '2025-09-21T14:17:51.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recoT51ICsiKcDOOf' 
       OR (LOWER(name) = LOWER('Kane Lu') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABpBNk0BymOf_bbIhKMxdDCG-wDwOtjW53s' )
);
-- Insert: Vince Tassone (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recoZZjiXX12YFvMG', 'Vince Tassone', NULL, 'https://www.linkedin.com/in/ACwAAAOWyFABjBlXNALdg2cx1BFlorP1hzGGTF8', 'Head of Business Development', 'Melbourne, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the electric forklift expansion. Smart move for the Melbourne market!', 'We''re working with some excellent sales professionals in the equipment space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their commercial teams.', 'I see you''re building out your sales team. How are you finding the local talent market in Melbourne? We''re noticing some interesting shifts around sales hires in the equipment sector, particularly with companies expanding their sustainable product lines.', '2025-09-25T05:19:38.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recoZZjiXX12YFvMG' 
       OR (LOWER(name) = LOWER('Vince Tassone') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOWyFABjBlXNALdg2cx1BFlorP1hzGGTF8' )
);
-- Insert: Matt Ditchburn (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recofUWreVDayokvJ', 'Matt Ditchburn', NULL, 'https://www.linkedin.com/in/ACwAACiNhCgBUVgvskJNb2AjsfmQ8hmD6eGxjHE', 'Sales Manager SA NT TAS', 'Greater Adelaide Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the ATS acquisition news. Great move strengthening the Melbourne presence!', 'We''re working with some excellent sales candidates in the industrial sector at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling through acquisitions.', 'I see you''re building out your team. How are you finding the local talent market post acquisition? We''re noticing some interesting shifts in the market, particularly around sales hires in industrial tools. The ATS integration must be creating some exciting opportunities for growth in Melbourne.', '2025-09-25T05:21:44.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recofUWreVDayokvJ' 
       OR (LOWER(name) = LOWER('Matt Ditchburn') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACiNhCgBUVgvskJNb2AjsfmQ8hmD6eGxjHE' )
);
-- Insert: Christian Whamond (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recooaC5cwS70mgCc', 'Christian Whamond', NULL, 'https://www.linkedin.com/in/ACwAAAOyA5gBXWMt2uBwBhbre-Jy83RaJ5cyjmk', 'National Sales Manager', 'Greater Adelaide Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the ATS acquisition news. Smart move expanding in Melbourne!', 'We''re working with some excellent sales professionals in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.', 'Hope you''re settling in well with the ATS integration. How are you finding the local talent market? We''re seeing some interesting shifts around sales hiring in Melbourne, particularly with companies scaling after acquisitions.', '2025-09-25T05:21:43.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recooaC5cwS70mgCc' 
       OR (LOWER(name) = LOWER('Christian Whamond') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOyA5gBXWMt2uBwBhbre-Jy83RaJ5cyjmk' )
);
-- Insert: Sean Taylor (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recp4h7R2QaNFV39c', 'Sean Taylor', NULL, 'https://www.linkedin.com/in/sean-taylor-2b19711', 'Executive Chairman', 'Malvern, Australia', 'new', NULL, '', NULL, 'Congrats on the UNICEPTA integration and expanding Prophet''s global media intelligence capabilities! That''s fantastic news.', 'We''re working with some excellent partnerships candidates across enterprise software if you''re looking externally.', 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around partnerships hires in enterprise software.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recp4h7R2QaNFV39c' 
       OR (LOWER(name) = LOWER('Sean Taylor') OR linkedin_url = 'https://www.linkedin.com/in/sean-taylor-2b19711' )
);
-- Insert: Jeremy Auerbach (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recpQORT0bn6BHDSF', 'Jeremy Auerbach', NULL, 'https://www.linkedin.com/in/jeremyauerbach', 'Head of Enterprise ANZ', 'Sydney, Australia', 'new', NULL, '', NULL, 'Love seeing monday.com''s focus on enterprise customers. Must be an exciting time in ANZ.', 'Hope you''re well! We''re working with some strong SDR Manager candidates at the moment. Happy to chat if useful.', 'I see you''re hiring an SDR Manager at monday.com. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recpQORT0bn6BHDSF' 
       OR (LOWER(name) = LOWER('Jeremy Auerbach') OR linkedin_url = 'https://www.linkedin.com/in/jeremyauerbach' )
);
-- Insert: Clint Elliott (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recpYFIBqCTtMDBKg', 'Clint Elliott', NULL, 'https://www.linkedin.com/in/ACwAAATjWbIBcqRSeBGi4CTrVeLVt0wg7PSg0BI', 'Regional Sales Manager - Western Australia', 'Perth, Western Australia, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the specialist business focus since the restructure. Smart move!', 'We''re working with some excellent account management talent in the tech space. Companies like HubSpot and Docusign have found our approach helpful when building out their strategic sales teams.', 'Hope you''re settling in well at Madison Group. How are you finding the IT services market at the moment? We''re seeing some interesting shifts in the talent space, particularly around strategic account management roles in tech distribution.', '2025-09-25T01:34:02.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recpYFIBqCTtMDBKg' 
       OR (LOWER(name) = LOWER('Clint Elliott') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATjWbIBcqRSeBGi4CTrVeLVt0wg7PSg0BI' )
);
-- Insert: Amy Zobec (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recpdnRqd7CgIjRN3', 'Amy Zobec', NULL, 'https://www.linkedin.com/in/ACwAAARq-roBv5Cu8VrZrnUoSezl3CtMDyGzyRk', 'Head of Digital Natives, Australia and New Zealand', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Stripe Tour Sydney event. Love the local expansion!', 'We''re seeing some strong SDR talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.', 'I see you''re in the SDR space at Stripe. How are you finding the local talent market? We''re noticing some interesting shifts around sales development hiring in Sydney, especially with all the fintech growth happening.', '2025-09-28T04:02:06.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recpdnRqd7CgIjRN3' 
       OR (LOWER(name) = LOWER('Amy Zobec') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAARq-roBv5Cu8VrZrnUoSezl3CtMDyGzyRk' )
);
-- Insert: Darin Milner (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recpecgItU0gi5QVa', 'Darin Milner', NULL, 'https://www.linkedin.com/in/ACwAAABvC-ABwpKIVxU1YBQMnGaqzsufzXumsyE', 'Head of Enterprise Sales', 'Greater Melbourne Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the GBG Go platform launch. That''s exciting timing for APAC growth!', 'We''re working with some excellent senior account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when expanding their regional teams.', 'I see you''re building out your ANZ team. How are you finding the talent market across the region? We''re noticing some interesting shifts around senior account management hires in identity verification, particularly with companies scaling their APAC operations like GBG.', '2025-09-29T14:17:01.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recpecgItU0gi5QVa' 
       OR (LOWER(name) = LOWER('Darin Milner') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABvC-ABwpKIVxU1YBQMnGaqzsufzXumsyE' )
);
-- Insert: Giulia Francesca Pineda (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recphu2dn4kctBcC0', 'Giulia Francesca Pineda', NULL, 'https://www.linkedin.com/in/ACwAAAYwYLIBYsB8Wo9yMNa5vv2gbpzhoG1vPh0', 'Enterprise Corporate Sales Manager II', 'Pakenham South, Victoria, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Melbourne office expansion. Great move for the ANZ market!', 'We''re working with some excellent mid-market AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Melbourne teams.', 'Hope you''re settling in well with the Melbourne expansion! How are you finding the local talent market for building out your sales team? We''re seeing some interesting shifts in the market, particularly around mid-market AE hires in the privacy and compliance space. The growth in local privacy regulations is creating some unique opportunities for companies like OneTrust.', '2025-09-22T14:27:19.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recphu2dn4kctBcC0' 
       OR (LOWER(name) = LOWER('Giulia Francesca Pineda') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAYwYLIBYsB8Wo9yMNa5vv2gbpzhoG1vPh0' )
);
-- Insert: Adam Beavis (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recpwxIwf8vdldLwJ', 'Adam Beavis', NULL, 'https://www.linkedin.com/in/adambeavis', 'Vice President & Country Manager', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the $1 billion Series K funding news. Huge milestone for Databricks!', 'We''re working with some excellent Engagement Manager candidates at the moment.', 'I see you''re hiring an Engagement Manager in Sydney at Databricks. How are you finding it with all the growth? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recpwxIwf8vdldLwJ' 
       OR (LOWER(name) = LOWER('Adam Beavis') OR linkedin_url = 'https://www.linkedin.com/in/adambeavis' )
);
-- Insert: Byron Rudenno (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recq1nSNFasBlnNIX', 'Byron Rudenno', NULL, 'https://www.linkedin.com/in/ACwAAABJOhgBMxDrdpWxAv5izPepCIiU_Fs7K_8', 'Senior Vice President, Europe & Asia-Pacific', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the APAC growth strategy through the Sydney office!', 'We''re working with some excellent senior account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC teams.', 'I see you''re building out your team. How are you finding the talent market across the region? We''re noticing some interesting shifts in the market, particularly around senior account management hires in the IT services space. The demand for experienced professionals who understand both local and regional dynamics has been really strong lately.', '2025-09-25T05:15:20.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recq1nSNFasBlnNIX' 
       OR (LOWER(name) = LOWER('Byron Rudenno') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABJOhgBMxDrdpWxAv5izPepCIiU_Fs7K_8' )
);
-- Insert: Chris Ponton Dwyer (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recqEX11RBZY77B6g', 'Chris Ponton Dwyer', NULL, 'https://www.linkedin.com/in/ACwAAAFvA1QBvKW9emMqnH2H_aS4TRiTtva3Vds', 'Director Enterprise Sales', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the PayTo milestone news. 1M+ transactions is impressive!', 'We''re working with some excellent BDR candidates in the Sydney market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams during rapid growth phases.', 'I see you''re building out your BDR team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the landscape, particularly around sales development hires in fintech. The growth you''re seeing with enterprise customers like those PayTo partnerships must be creating some exciting opportunities for your team.', '2025-09-28T03:56:47.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recqEX11RBZY77B6g' 
       OR (LOWER(name) = LOWER('Chris Ponton Dwyer') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFvA1QBvKW9emMqnH2H_aS4TRiTtva3Vds' )
);
-- Insert: Dane Hart (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recqPmhFoblnYAZl2', 'Dane Hart', NULL, 'https://www.linkedin.com/in/dane-hart-1a20612', 'Head of Enterprise Sales & Partnerships | APAC', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the digital Forward product launch. Love seeing the innovation in SME payments.', 'We''re working with some excellent Account Managers in payments at the moment. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your team. How are you finding the account management talent market? We''re noticing some interesting shifts in the landscape, particularly around Client Account Manager hires in fintech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recqPmhFoblnYAZl2' 
       OR (LOWER(name) = LOWER('Dane Hart') OR linkedin_url = 'https://www.linkedin.com/in/dane-hart-1a20612' )
);
-- Insert: Alicia Boey (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recqWizVkBIv5yzOt', 'Alicia Boey', NULL, 'https://www.linkedin.com/in/alicia-boey-40367488', 'HR Operation and Payroll Manager APAC', 'Singapore, Singapore', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), 'Congrats on closing the AIB Merchant Services acquisition! That''s fantastic news for the European expansion.', 'We''re working with some excellent Sales Director candidates across fintech.', 'I see you''re building out your team for Fiserv. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in fintech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recqWizVkBIv5yzOt' 
       OR (LOWER(name) = LOWER('Alicia Boey') OR linkedin_url = 'https://www.linkedin.com/in/alicia-boey-40367488' )
);
-- Insert: Colin Birney (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recqZZo1eyBzCVww9', 'Colin Birney', NULL, 'https://www.linkedin.com/in/colin-birney-17b4472', 'Head Of Sales at Square AU', 'Melbourne, Australia', 'new', NULL, '', NULL, 'Saw Square AI entered beta. That''s exciting for seller insights!', 'We''re working with some great onboarding specialists at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their seller enablement teams.', 'I see you''re building out your seller onboarding team. How are you finding the market? With all the new Square product launches, I imagine onboarding complexity is growing. We''re seeing some interesting shifts in the talent landscape, particularly around onboarding specialist hires in fintech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recqZZo1eyBzCVww9' 
       OR (LOWER(name) = LOWER('Colin Birney') OR linkedin_url = 'https://www.linkedin.com/in/colin-birney-17b4472' )
);
-- Insert: Harry Chichadjian (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recqaPwfz1TaFQwM0', 'Harry Chichadjian', NULL, 'https://www.linkedin.com/in/ACwAAAyUsaoB0Tz0nauhFlIPnqYBWCA8fsvoWV0', 'Security Sales Director', 'Greater Melbourne Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Love the Tech Data partnership news. Exciting for the ANZ market!', 'We''re working with some excellent enterprise AE candidates at the moment, particularly those with government experience. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams in competitive markets.', 'Hope you''re well Harry! I see you''re building out your federal government team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise AE hires in the government sector. With all the AI investment happening locally, there''s definitely more competition for quality sales talent. Would love to chat about what we''re seeing in the market.', '2025-09-20T14:29:07.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recqaPwfz1TaFQwM0' 
       OR (LOWER(name) = LOWER('Harry Chichadjian') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAyUsaoB0Tz0nauhFlIPnqYBWCA8fsvoWV0' )
);
-- Insert: Mel Lucas (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recqtSN9Do1MtNIq7', 'Mel Lucas', NULL, 'https://www.linkedin.com/in/ACwAABWFjqsB6VGYEmVXqWINgzgqCMq3xRHH6cI', 'New Business Sales Manager - ANZ', 'Melbourne, Victoria, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Love seeing the Sydney regional sales setup!', 'We''re working with some excellent Enterprise Account Manager candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise sales teams.', 'I see you''re building out your Enterprise Account Manager team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales hires in cybersecurity. The competition for quality AEs has definitely heated up locally.', '2025-09-28T04:12:35.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recqtSN9Do1MtNIq7' 
       OR (LOWER(name) = LOWER('Mel Lucas') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABWFjqsB6VGYEmVXqWINgzgqCMq3xRHH6cI' )
);
-- Insert: James P. Hunt (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recqwgPEDcG9HOaqb', 'James P. Hunt', NULL, 'https://www.linkedin.com/in/ACwAABCHdYIBr00hL3lxiB51tJqoxgl9RhroRuk', 'Manager, Sales & Sales Development Teams', 'Greater Sydney Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Deputy Payroll launch in Australia. That''s exciting!', 'We''re seeing some excellent account management talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their client-facing teams.', 'Hope you''re well James! I see Deputy''s really pushing the new payroll solution across Sydney. How are you finding the market response from hospitality and retail clients? We''re noticing some interesting shifts in the talent landscape, particularly around account management hires in workforce management.', '2025-09-20T14:15:40.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recqwgPEDcG9HOaqb' 
       OR (LOWER(name) = LOWER('James P. Hunt') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABCHdYIBr00hL3lxiB51tJqoxgl9RhroRuk' )
);
-- Insert: Geoff Prentis (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recr4uYc7Wbh38g8W', 'Geoff Prentis', NULL, 'https://www.linkedin.com/in/geoff-prentis-b00a564', 'Vice President, Solutions Engineering - APJ', 'Melbourne, Australia', 'new', NULL, '', NULL, 'Love seeing the Gartner Magic Quadrant recognition. Well deserved!', 'Hope you''re well! We''re working with some experienced CSMs in the cybersecurity space. Happy to chat if useful.', 'I see you''re hiring CSMs at Netskope. How''s the market treating you? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recr4uYc7Wbh38g8W' 
       OR (LOWER(name) = LOWER('Geoff Prentis') OR linkedin_url = 'https://www.linkedin.com/in/geoff-prentis-b00a564' )
);
-- Insert: Julian Lock (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recr9dA9XQBAmIO15', 'Julian Lock', NULL, 'https://www.linkedin.com/in/ACwAAAEwvkQBLlxtnjb21fPWmyLZs0tTGTTsEEc', 'Senior Sales Director - APAC', 'Greater Brisbane Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love seeing the Sydney presence grow. Smart APAC expansion!', 'We''re working with some excellent senior account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC operations.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around account management hires in Sydney, particularly with the research and advisory space heating up.', '2025-09-25T04:51:23.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recr9dA9XQBAmIO15' 
       OR (LOWER(name) = LOWER('Julian Lock') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEwvkQBLlxtnjb21fPWmyLZs0tTGTTsEEc' )
);
-- Insert: Jonathon Coleman (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recrJXIWpZzUFVdEu', 'Jonathon Coleman', NULL, 'https://www.linkedin.com/in/ACwAAAirubUBRn2XeS70vqtz-WyqwQ7mK1Z11f8', 'General Manager, APAC', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the $150M Series D news. Congrats on the funding!', 'We''re working with some strong SDR candidates in cybersecurity at the moment. Companies like HubSpot and Docusign have found our approach helpful for APJ expansion.', 'I see you''re building out your APJ sales team. How are you finding the market for SDRs in cybersecurity? We''re noticing some interesting shifts in the talent landscape, particularly around compliance tech hires in the region.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recrJXIWpZzUFVdEu' 
       OR (LOWER(name) = LOWER('Jonathon Coleman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAirubUBRn2XeS70vqtz-WyqwQ7mK1Z11f8' )
);
-- Insert: Malik Ullah (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recrmnmpkClp0rGFH', 'Malik Ullah', NULL, 'https://www.linkedin.com/in/ACwAABSWS04BMpi9C8bpyrmAMOphd7E48o6biIc', 'Sales Manager', 'Greater Melbourne Area, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw you''re with menumiz™. Love the work you''re doing in restaurant tech.', 'We''re working with some great BDE candidates at the moment. We helped HubSpot and Docusign with similar roles.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around BDE hires in restaurant tech.', '2025-09-17T14:36:20.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recrmnmpkClp0rGFH' 
       OR (LOWER(name) = LOWER('Malik Ullah') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABSWS04BMpi9C8bpyrmAMOphd7E48o6biIc' )
);
-- Insert: Max McNamara (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recsFIYqjezkFlA3E', 'Max McNamara', NULL, 'https://www.linkedin.com/in/ACwAAAnGdWYBALQtJIhmsZDnsj9afulCjw0sSTI', 'Vice President & Managing Director, Australia & New Zealand', 'Greater Sydney Area', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-25T02:32:43.855Z', 'Saw the news about the new Sydney office at Australia Square Plaza. That''s exciting!', 'We''re working with some excellent Account Manager candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases like yours.', 'I see you''re building out your team with the Sydney expansion. How are you finding the local talent market? We''re noticing some interesting shifts in the talent market, particularly around Account Manager hires in data security. The timing with your office opening must be creating some good opportunities.', '2025-09-23T14:23:20.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recsFIYqjezkFlA3E' 
       OR (LOWER(name) = LOWER('Max McNamara') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAnGdWYBALQtJIhmsZDnsj9afulCjw0sSTI' )
);
-- Insert: Alex Burton (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recsSWpKQKyNR5ozq', 'Alex Burton', NULL, 'https://www.linkedin.com/in/ACwAAAT2048B122_qx9pya8C-AQ-92Uubs3z56Q', 'Director, Sales', 'Sydney, New South Wales, Australia', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-21T23:25:39.064Z', 'Saw the Sydney office expansion. Love the local growth!', 'We''re working with some excellent account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the landscape, particularly around account management hires in the SaaS space.', '2025-09-20T06:31:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recsSWpKQKyNR5ozq' 
       OR (LOWER(name) = LOWER('Alex Burton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAT2048B122_qx9pya8C-AQ-92Uubs3z56Q' )
);
-- Insert: Krista Gustafson (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recsSplvUkS6cyDKJ', 'Krista Gustafson', NULL, 'https://www.linkedin.com/in/ACwAAAzf1qABnShFldMvTWIzjUmD9JnMJRKLS1o', 'Director of Sales', 'Cremorne, New South Wales, Australia', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-29T01:05:52.630Z', 'Saw the Better by SafetyCulture event in Sydney. That looked fantastic!', 'We''re working with some excellent senior AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise sales teams.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around senior AE hires in the SaaS space. The demand for enterprise sales talent in Sydney has been pretty intense lately.', '2025-09-28T14:42:05.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recsSplvUkS6cyDKJ' 
       OR (LOWER(name) = LOWER('Krista Gustafson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAzf1qABnShFldMvTWIzjUmD9JnMJRKLS1o' )
);
-- Insert: Paul Vella (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recsXUWYVWDiOyJ3c', 'Paul Vella', NULL, 'https://www.linkedin.com/in/ACwAAACVQxsBQ23KhD2UDsIPYFVsxKiaog4bj8M', 'Regional Sales Manager, A/NZ', 'Greater Sydney Area', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-21T23:28:40.656Z', 'Love the Australian expansion. That Sydney SDR role looks exciting!', 'We''re seeing some strong SDR talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Australian teams.', 'I see you''re building out the Sydney team. How are you finding the talent market for SDR hires? We''re noticing some interesting shifts in the market, particularly around sales development roles in the data platform space.', '2025-09-20T06:14:58.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recsXUWYVWDiOyJ3c' 
       OR (LOWER(name) = LOWER('Paul Vella') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACVQxsBQ23KhD2UDsIPYFVsxKiaog4bj8M' )
);
-- Insert: Jenny undefined (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recsboZ42vIyN5NTL', 'Jenny undefined', NULL, 'https://www.linkedin.com/in/ACwAAErssD8BlwGaYN-bKCKF2anROPEGrQGufbs', 'Sales Manager', 'Melbourne, Victoria, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Love the APAC expansion. Exciting growth in the region!', 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out their outbound teams.', 'I see you''re building out your SDR team. How are you finding the talent market across the region? We''re noticing some interesting shifts around outbound sales hires, particularly with companies scaling their remote teams in APAC.', '2025-09-28T04:09:50.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recsboZ42vIyN5NTL' 
       OR (LOWER(name) = LOWER('Jenny undefined') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAErssD8BlwGaYN-bKCKF2anROPEGrQGufbs' )
);
-- Insert: Angus Kilian (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recseSYfZzNJxPpkw', 'Angus Kilian', NULL, 'https://www.linkedin.com/in/ACwAAAemIT0Bjlhb_Q_wtH_oLuhi39NfoyMoP-g', 'Head of GTM, APAC & Middle East, Investor Services', 'Greater Sydney Area', 'messaged', 'High', 'LinkedIn Job Posts', '2025-09-21T23:27:17.630Z', 'Saw the Sydney office launch news. That''s exciting to see Carta establishing local operations!', 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out local sales teams.', 'I see you''re building out the sales team locally. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in fintech. The move from remote to in-market teams seems to be a smart play for companies scaling in APAC.', '2025-09-20T02:47:41.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recseSYfZzNJxPpkw' 
       OR (LOWER(name) = LOWER('Angus Kilian') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAemIT0Bjlhb_Q_wtH_oLuhi39NfoyMoP-g' )
);
-- Insert: James Delmar (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recspi8HgT7LJCNWp', 'James Delmar', NULL, 'https://www.linkedin.com/in/ACwAAADTlm0BkNi_VcjlJ7x9v7aG1UAWOF6uIcM', 'Senior Account Director', 'Greater Sydney Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the WarpStream acquisition news. Great move expanding the platform capabilities.', 'We''re working with some excellent Enterprise AEs at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their strategic sales functions.', 'I see you''re building out your enterprise sales team. How are you finding the market for strategic AEs? We''re noticing some interesting shifts in the data streaming space, particularly around enterprise sales hires in SaaS.', '2025-09-18T20:58:44.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recspi8HgT7LJCNWp' 
       OR (LOWER(name) = LOWER('James Delmar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADTlm0BkNi_VcjlJ7x9v7aG1UAWOF6uIcM' )
);
-- Insert: Richard Wong (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recsylV4kkpeiH319', 'Richard Wong', NULL, 'https://www.linkedin.com/in/richardwongaustralia', 'Senior Director Customer Success, Australia & New Zealand', 'Melbourne, Australia', 'new', NULL, '', NULL, 'Saw the Gartner Customers'' Choice award for Cloud ERP. Well deserved!', 'Hope you''re well! We''re working with some strong presales candidates in the AI space. Happy to chat if useful.', 'I see you''re hiring a Presales Consultant for AI Growth at IFS. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recsylV4kkpeiH319' 
       OR (LOWER(name) = LOWER('Richard Wong') OR linkedin_url = 'https://www.linkedin.com/in/richardwongaustralia' )
);
-- Insert: Brian Zerafa (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rect3C9njDEVqC6zO', 'Brian Zerafa', NULL, 'https://www.linkedin.com/in/brianzerafa', 'Regional Sales Director', 'Melbourne, Australia', 'new', NULL, '', NULL, 'Saw the IPO filing news. Congrats on the NASDAQ listing!', 'Hope you''re well! We''re working with some strong CSM candidates at the moment. Happy to chat if useful.', 'I see you''re hiring CSMs at Netskope. How are you finding it with all the growth? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rect3C9njDEVqC6zO' 
       OR (LOWER(name) = LOWER('Brian Zerafa') OR linkedin_url = 'https://www.linkedin.com/in/brianzerafa' )
);
-- Insert: Dan Shaw (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rectKW4AKpdXGqoOv', 'Dan Shaw', NULL, 'https://www.linkedin.com/in/danshawcontact', 'Sales Director, Global Cloud APAC', 'Bendigo, Australia', 'new', NULL, '', NULL, 'Saw the Series G news. $450M is huge - congrats Dan!', 'We''re working with some solid Sales Development Manager candidates in APAC at the moment.', 'I see you''re hiring a Sales Development Manager at Rippling. How''s the APAC market treating you? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rectKW4AKpdXGqoOv' 
       OR (LOWER(name) = LOWER('Dan Shaw') OR linkedin_url = 'https://www.linkedin.com/in/danshawcontact' )
);
-- Insert: Simon Horrocks (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rectNXY59eexHTyAb', 'Simon Horrocks', NULL, 'https://www.linkedin.com/in/ACwAAABADB4BO2VYiDBOL50nKw434VXBEgwfZgU', 'Vice President APAC', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Congrats on the VP APAC role! Love the Australian cloud expansion.', 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases across the region.', 'I see you''re building out your Sydney team. How are you finding the talent market with all the rapid expansion happening across APAC? We''re noticing some interesting shifts in the landscape, particularly around Enterprise AE hires in the CX space. The regulated industries seem to be moving fast since the local cloud launch.', '2025-09-28T03:55:16.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rectNXY59eexHTyAb' 
       OR (LOWER(name) = LOWER('Simon Horrocks') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABADB4BO2VYiDBOL50nKw434VXBEgwfZgU' )
);
-- Insert: Antoine LeTard (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rectOFtYlqt5HMByS', 'Antoine LeTard', NULL, 'https://www.linkedin.com/in/ACwAAAA3NGUB42-pq_RDAlfX5Rx1rrIgcasgXMs', 'AVP, Strategy & Operations APJ', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the SDR role posting for Melbourne. Great to see the local expansion!', 'We''re working with some excellent SDR candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent space, particularly around SDR hires in Melbourne. The demand for experienced enterprise sales talent has really picked up lately.', '2025-09-20T14:12:39.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rectOFtYlqt5HMByS' 
       OR (LOWER(name) = LOWER('Antoine LeTard') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAA3NGUB42-pq_RDAlfX5Rx1rrIgcasgXMs' )
);
-- Insert: Justin Flower (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rectRoRQ1pkMZeNO6', 'Justin Flower', NULL, 'https://www.linkedin.com/in/ACwAAABKazoBJeCu9HJb7S11DpNkqgKgwa_KWxI', 'Senior Sales Director - ANZ', 'Greater Melbourne Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love seeing the Sydney office expansion at Phillips Street. Exciting growth!', 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases, particularly when building out senior sales roles in competitive markets.', 'I see you''re building out your Enterprise team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in cybersecurity. The Sydney market has been quite active lately, especially with companies scaling their sales functions. I run Launchpad, APAC''s largest invite-only GTM leader community, and also help companies like yours scale their teams through 4Twenty Consulting. Would love to share what we''re seeing in the market.', '2025-09-28T04:12:34.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rectRoRQ1pkMZeNO6' 
       OR (LOWER(name) = LOWER('Justin Flower') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABKazoBJeCu9HJb7S11DpNkqgKgwa_KWxI' )
);
-- Insert: Chantelle Conway (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rectVS1YdbGNyICcw', 'Chantelle Conway', NULL, 'https://www.linkedin.com/in/chantelleconway', 'Senior Sales Director (RVP)', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the $1 billion Series K news. What a milestone for Databricks!', 'We''re working with some strong Engagement Manager candidates at the moment.', 'I see you''re hiring an Engagement Manager in Sydney at Databricks. How are you finding it with all the growth happening? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rectVS1YdbGNyICcw' 
       OR (LOWER(name) = LOWER('Chantelle Conway') OR linkedin_url = 'https://www.linkedin.com/in/chantelleconway' )
);
-- Insert: Isaac Lowrie (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rectVc3bJHbT9GI13', 'Isaac Lowrie', NULL, 'https://www.linkedin.com/in/isaac-lowrie-80249131', 'General Manager - Venue Team | Head of Strategy', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw Ordermentum hit $2 billion in transactions. What a milestone! Congrats on the achievement.', 'Hope you''re well! We''re working with some experienced Sales Enablement candidates at the moment. Happy to chat if useful.', 'I see you''re hiring a Sales Enablement Manager at Ordermentum. How are you finding it? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rectVc3bJHbT9GI13' 
       OR (LOWER(name) = LOWER('Isaac Lowrie') OR linkedin_url = 'https://www.linkedin.com/in/isaac-lowrie-80249131' )
);
-- Insert: Varun Sareen (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rectbmL5AVFH6uWXT', 'Varun Sareen', NULL, 'https://www.linkedin.com/in/ACwAADIbDxQBg11P5UG_5xS65BTEDXNu-4rZIZE', 'Regional Sales Manager', 'Melbourne, Victoria, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Love seeing Cvent''s Melbourne office expansion!', 'We''re working with some excellent Account Manager candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Manager hires in Melbourne, especially with the events industry picking up momentum again.', '2025-09-23T14:18:54.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rectbmL5AVFH6uWXT' 
       OR (LOWER(name) = LOWER('Varun Sareen') OR linkedin_url = 'https://www.linkedin.com/in/ACwAADIbDxQBg11P5UG_5xS65BTEDXNu-4rZIZE' )
);
-- Insert: Andrew Mamonitis (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rectcO5nArXefQ8EP', 'Andrew Mamonitis', NULL, 'https://www.linkedin.com/in/ACwAAAKve5kBeQOPGRXYdRfTBuoMZaGfyXFeeQM', 'Vice President APAC - Manufacturing Division', 'Melbourne, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the TrustRadius awards news. Congrats on the eight wins!', 'We''re working with some excellent Regional Sales Executives at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Regional Sales Executive hires in software solutions.', '2025-09-17T14:20:45.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rectcO5nArXefQ8EP' 
       OR (LOWER(name) = LOWER('Andrew Mamonitis') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKve5kBeQOPGRXYdRfTBuoMZaGfyXFeeQM' )
);
-- Insert: Andrew McCarthy (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rectn64A84kMTQRZO', 'Andrew McCarthy', NULL, 'https://www.linkedin.com/in/ACwAAAP2OIEBhvmsGs4CE-6xJ22XbVoQB91JuM8', 'GM of ANZ, SEA and India', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Sydney headquarters launch. That''s exciting!', 'We''re working with some excellent senior sales candidates in the Sydney market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC operations.', 'I see you''re building out the team with plans to double headcount. How are you finding the local talent market for sales roles? We''re noticing some interesting shifts around senior sales hiring in Sydney, particularly with the competition heating up for experienced APAC sales leaders.', '2025-09-25T03:52:50.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rectn64A84kMTQRZO' 
       OR (LOWER(name) = LOWER('Andrew McCarthy') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAP2OIEBhvmsGs4CE-6xJ22XbVoQB91JuM8' )
);
-- Insert: Pete Waldron (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rectpbiQYNKRqy9n3', 'Pete Waldron', NULL, 'https://www.linkedin.com/in/ACwAAANqzxEBHz3b05ITH52z87B8L8iyQ18Vyqw', 'Head of Sales, Australia & New Zealand', 'Sydney, Australia', 'new', NULL, '', NULL, 'Saw the OpenPay acquisition news. That''s exciting for the billing expansion!', 'We''re working with some strong SDR candidates in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases.', 'I see you''re building out your team. How are you finding the fintech talent market with all the growth happening? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in payments and fintech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rectpbiQYNKRqy9n3' 
       OR (LOWER(name) = LOWER('Pete Waldron') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAANqzxEBHz3b05ITH52z87B8L8iyQ18Vyqw' )
);
-- Insert: Brendon Mitchell (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rects6EbyP1b9gzrC', 'Brendon Mitchell', NULL, 'https://www.linkedin.com/in/ACwAAADD53IBe7WZIzMPlk8jHd30OX2MieKnr2U', 'Regional Sales Manager', 'Melbourne, Victoria, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw OPSWAT at the Sydney Security Exhibition. Great local presence!', 'We''re working with some excellent cybersecurity sales professionals at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their regional teams.', 'I see you''re building out the regional sales team. How are you finding the cybersecurity talent market in Sydney? We''re noticing some interesting shifts in the market, particularly around sales hires in the cybersecurity space. With OPSWAT''s increased local presence through events and the new Sektor Cyber partnership, there''s clearly momentum building. Would love to chat about what we''re seeing in the market.', '2025-09-20T14:18:26.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rects6EbyP1b9gzrC' 
       OR (LOWER(name) = LOWER('Brendon Mitchell') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADD53IBe7WZIzMPlk8jHd30OX2MieKnr2U' )
);
-- Insert: Theo Gessas (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'rectzxXmzoQnBzFMR', 'Theo Gessas', NULL, 'https://www.linkedin.com/in/ACwAAAOKHQUBdgy57nX289k5GO6NuhEBGNivRUw', 'Regional Sales Director - South Pacific & A/NZ', 'Greater Melbourne Area', 'in queue', 'High', 'LinkedIn Job Posts', '2025-09-21T23:31:53.841Z', 'Saw the Onfido acquisition news. Great move for the APAC market!', 'We''re working with some excellent senior sales professionals in the cybersecurity space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their government sales teams.', 'Hope you''re well Theo! I see you''re focused on the government sector. How are you finding the market for identity verification solutions? We''re noticing some interesting shifts in the talent space, particularly around senior sales roles in cybersecurity. The Onfido integration must be opening up some exciting opportunities for government clients.', '2025-09-20T06:41:38.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'rectzxXmzoQnBzFMR' 
       OR (LOWER(name) = LOWER('Theo Gessas') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOKHQUBdgy57nX289k5GO6NuhEBGNivRUw' )
);
-- Insert: Tiffany Nee (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recu3fRB91qDpA2zY', 'Tiffany Nee', NULL, 'https://www.linkedin.com/in/tiffany-nee-242b242bb', 'Sales Manager', 'Singapore, Singapore', 'new', NULL, '', NULL, 'Saw the Milvus 2.6 release. Love seeing the AI infrastructure focus.', 'Hope you''re well! We''re working with some excellent Enterprise AE candidates in the ANZ market. Happy to chat if useful.', 'I see you''re hiring Enterprise AEs in ANZ at Zilliz. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recu3fRB91qDpA2zY' 
       OR (LOWER(name) = LOWER('Tiffany Nee') OR linkedin_url = 'https://www.linkedin.com/in/tiffany-nee-242b242bb' )
);
-- Insert: Michael Shnider (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recu7tk4T0w0wnJRl', 'Michael Shnider', NULL, 'https://www.linkedin.com/in/michael-shnider-9956303', 'Regional Sales Manager, APAC', 'Australia', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), 'Love seeing the Avasant recognition. Well deserved!', 'We''re working with some strong candidates in the tech consulting space.', 'I see you''re hiring for the Service Line Specialist role at Cognizant. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recu7tk4T0w0wnJRl' 
       OR (LOWER(name) = LOWER('Michael Shnider') OR linkedin_url = 'https://www.linkedin.com/in/michael-shnider-9956303' )
);
-- Insert: John Petty (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recu9I00xw9FOgiiI', 'John Petty', NULL, 'https://www.linkedin.com/in/ACwAACASePcBfp1xMCAf2VWPg0ggvFrYu0mkcQY', 'Head of People & Talent', 'Surry Hills, New South Wales, Australia', 'new', NULL, '', NULL, 'Saw the Square partnership news. Love the bundled solution approach for hospitality venues.', 'We''re working with some strong BD candidates in hospitality tech at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.', 'I see you''re building out your team. How are you finding the hospitality tech market? We''re noticing some interesting shifts in the talent landscape, particularly around BD hires in food tech and venue solutions.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recu9I00xw9FOgiiI' 
       OR (LOWER(name) = LOWER('John Petty') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACASePcBfp1xMCAf2VWPg0ggvFrYu0mkcQY' )
);
-- Insert: David Chester🎗 (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recuBBThoXHYTEdsf', 'David Chester🎗', NULL, 'https://www.linkedin.com/in/ACwAAAUPjPgBAftV8amZGGGw37epDNR023KWRH4', 'Business Development Manager', 'Melbourne, Victoria, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Ascend Australia summit in Melbourne. Love the local focus!', 'We''re working with some excellent AE candidates in the fintech and fraud prevention space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney operations.', 'I see you''re building out your Sydney team. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around Account Executive hires in the fraud prevention space. The growth you''re seeing with local merchants like Cotton On and Meshki must be creating some exciting opportunities.', '2025-09-28T14:32:58.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recuBBThoXHYTEdsf' 
       OR (LOWER(name) = LOWER('David Chester🎗') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAUPjPgBAftV8amZGGGw37epDNR023KWRH4' )
);
-- Insert: Emma G. (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recuEwdgvzLQezEHA', 'Emma G.', NULL, 'https://www.linkedin.com/in/ACwAAAEW-OMBSiUikiQc5od9J74QxJZrZw67yto', 'Sales Director - Enterprise ANZ', 'Greater Melbourne Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the new Sydney data centre launch. That''s exciting!', 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases like yours.', 'I see you''re building out your team with the ANZ expansion. How are you finding the local talent market? We''re noticing some interesting shifts around Enterprise AE hiring in Sydney, especially with all the growth happening in the market right now.', '2025-09-20T06:22:47.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recuEwdgvzLQezEHA' 
       OR (LOWER(name) = LOWER('Emma G.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEW-OMBSiUikiQc5od9J74QxJZrZw67yto' )
);
-- Insert: Zach Sevelle (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recuT26bOW0ated68', 'Zach Sevelle', NULL, 'https://www.linkedin.com/in/ACwAACvIM1YBsdxZ0yJ3OMSZsN5STupfrySEbwA', 'Sales Director, APAC', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the capital raising news. Exciting times for the Sydney team!', 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during their expansion phases.', 'I see you''re building out your SDR team. How are you finding the local talent market? We''re noticing some interesting shifts around sales development hires in Sydney, particularly with companies scaling their GenieAI and go-to-market functions.', '2025-09-28T04:07:37.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recuT26bOW0ated68' 
       OR (LOWER(name) = LOWER('Zach Sevelle') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACvIM1YBsdxZ0yJ3OMSZsN5STupfrySEbwA' )
);
-- Insert: Sebastian M. (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recuj8cGVdyCoeMFq', 'Sebastian M.', NULL, 'https://www.linkedin.com/in/ACwAAAjEKkcBfGx73aRaQ2GMjH-uJYbD_KS-PiQ', 'Regional Director, ASEAN', 'Singapore, Singapore', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Singapore partnership for APAC expansion. That''s exciting!', 'We''re working with some excellent mid market AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their regional scaling phases.', 'I see you''re building out your team. How are you finding the talent market across the region? We''re noticing some interesting shifts in the landscape, particularly around mid market AE hires in cybersecurity. The demand for AI-powered security expertise has been incredible lately.', '2025-09-28T04:11:19.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recuj8cGVdyCoeMFq' 
       OR (LOWER(name) = LOWER('Sebastian M.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAjEKkcBfGx73aRaQ2GMjH-uJYbD_KS-PiQ' )
);
-- Insert: Mathew Lovelock (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recur4xxsoo7nwnCW', 'Mathew Lovelock', NULL, 'https://www.linkedin.com/in/ACwAAFtMhgYBW-sYekAJIBGyT7vFrecRjJtruCI', 'Sales Director, APAC', 'Perth, Western Australia, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Weir acquisition news. That''s huge for Perth!', 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Tracksuit have found our approach helpful when scaling their teams during high growth phases.', 'Hope you''re well Mathew! With the Weir acquisition and all the growth at Micromine, I imagine you''re thinking about scaling the team. How are you finding the talent market in Perth? We''re seeing some interesting shifts around enterprise sales hires in the mining tech space, especially with all the activity happening locally.', '2025-09-28T04:05:26.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recur4xxsoo7nwnCW' 
       OR (LOWER(name) = LOWER('Mathew Lovelock') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAFtMhgYBW-sYekAJIBGyT7vFrecRjJtruCI' )
);
-- Insert: Dave O''Connor (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recusL4GOkdaGuQwG', 'Dave O''Connor', NULL, 'https://www.linkedin.com/in/ACwAAAuWpZQBiUosv7otszGx3nMV5ok5qH-N3ZU', 'Head of Sales', 'The Rocks, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the $250M ARR milestone. That''s exciting growth!', 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when they''re scaling their inbound teams.', 'I see you''re building out your sales team. How are you finding the talent market in Sydney? We''re noticing some interesting shifts around SDR hiring, particularly with companies scaling as fast as Employment Hero. The demand for quality inbound sales talent has been pretty competitive lately.', '2025-09-28T03:59:33.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recusL4GOkdaGuQwG' 
       OR (LOWER(name) = LOWER('Dave O''Connor') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAuWpZQBiUosv7otszGx3nMV5ok5qH-N3ZU' )
);
-- Insert: Harsha Hariharan (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recuweeSVz2qOHOJJ', 'Harsha Hariharan', NULL, 'https://www.linkedin.com/in/ACwAAAYKGFgBN8QyhsDGGV_KqcG6vmWvR1nPN6U', 'Regional Sales Director', 'Singapore', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw Cvent at AIME Melbourne. Love the local events focus!', 'We''re working with some excellent account management candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.', 'I see you''re building out your account management team in Melbourne. How are you finding the local talent market? We''re noticing some interesting shifts around account management hires in the events tech space, particularly with companies expanding their local presence like Cvent has been doing.', '2025-09-23T14:18:54.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recuweeSVz2qOHOJJ' 
       OR (LOWER(name) = LOWER('Harsha Hariharan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAYKGFgBN8QyhsDGGV_KqcG6vmWvR1nPN6U' )
);
-- Insert: Carol Sun (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recvBbsB4iaIpwmfJ', 'Carol Sun', NULL, 'https://www.linkedin.com/in/ACwAAAsI14IBuGinqMwJB3rao0IAXM9ubyukOlc', 'Head of Sales | Singapore & Greater China Region', 'Singapore', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the CloudTech partnership in Melbourne. Love the local momentum!', 'We''re working with some excellent sales talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases like this.', 'I see you''re building out your sales team in Victoria. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around sales director and AE hires in fintech. The expansion with CloudTech and other Melbourne partnerships suggests some exciting growth ahead.', '2025-09-21T14:10:15.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recvBbsB4iaIpwmfJ' 
       OR (LOWER(name) = LOWER('Carol Sun') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAsI14IBuGinqMwJB3rao0IAXM9ubyukOlc' )
);
-- Insert: John Cunningham (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recvCqnk4q9bmG3zT', 'John Cunningham', NULL, 'https://www.linkedin.com/in/ACwAAAAH_kIBbwloAtOae0M8CZPiAIYUYUKa4cI', 'Vice President International Sales', 'Clovelly, Australia', 'connection_requested', NULL, 'LinkedIn Job Posts', '2025-09-19T05:28:36.258Z', 'Saw Securiti made CRN''s top 20 coolest network security companies. Congrats on the recognition!', 'We''re working with some strong channel sales professionals in cybersecurity at the moment. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out the channel sales function. How are you finding the cybersecurity market in ANZ? We''re noticing some interesting shifts in the talent landscape, particularly around channel sales hires in network security.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recvCqnk4q9bmG3zT' 
       OR (LOWER(name) = LOWER('John Cunningham') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAH_kIBbwloAtOae0M8CZPiAIYUYUKa4cI' )
);
-- Insert: Ashutosh Uniyal (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recvOzeMkUtXWDkq4', 'Ashutosh Uniyal', NULL, 'https://www.linkedin.com/in/ashutoshuniyal1', 'Vice President of Sales', 'Melbourne, Australia', 'in queue', NULL, 'LinkedIn Job Posts', NOW(), 'Congrats on HCLTech being recognised as Global Alliances AI Partner of the Year! That''s fantastic news.', 'We''re working with some excellent Sales Director candidates across enterprise software if you''re looking externally.', 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in enterprise software.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recvOzeMkUtXWDkq4' 
       OR (LOWER(name) = LOWER('Ashutosh Uniyal') OR linkedin_url = 'https://www.linkedin.com/in/ashutoshuniyal1' )
);
-- Insert: De''Angello Harris (LEAD LOST)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recvPAh0ed6Lb74gc', 'De''Angello Harris', NULL, 'https://www.linkedin.com/in/deangello', 'VP Sales, APAC', 'Sydney, Australia', 'lead_lost', NULL, 'LinkedIn Job Posts', NOW(), 'Love seeing APAC sales leaders building strong teams across the region.', 'We''re working with some excellent Sales Director candidates across enterprise software.', 'I see you''re building out your team for Think & Grow. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in enterprise software.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recvPAh0ed6Lb74gc' 
       OR (LOWER(name) = LOWER('De''Angello Harris') OR linkedin_url = 'https://www.linkedin.com/in/deangello' )
);
-- Insert: Nikhil Rolla (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recvPsd4mPt4pWvdo', 'Nikhil Rolla', NULL, 'https://www.linkedin.com/in/nikhilrolla', 'Country General Manager, Malaysia GBS & Head of Strategic Accounts, SEA', 'Singapore, Singapore', 'new', NULL, '', NULL, 'Congrats on the TikTok Shop launch! That''s been such an exciting development to watch.', 'We''re working with some excellent BDM candidates across tech.', 'I see you''re building out your team for TikTok. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around BDM hires in tech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recvPsd4mPt4pWvdo' 
       OR (LOWER(name) = LOWER('Nikhil Rolla') OR linkedin_url = 'https://www.linkedin.com/in/nikhilrolla' )
);
-- Insert: Shane Brown (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recvTgdkiKeBSeS91', 'Shane Brown', NULL, 'https://www.linkedin.com/in/ACwAAAwISTQBtO7_eEoEDkNWw0NbFAighj9pqkY', 'Regional Manager', 'Brisbane, Queensland, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the international expansion focus at Sprinklr. That''s exciting!', 'We''re working with some excellent enterprise SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.', 'I see you''re building out your enterprise sales team. How are you finding the market for senior SDR talent? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise SDR hires in the CX space.', '2025-09-20T14:22:22.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recvTgdkiKeBSeS91' 
       OR (LOWER(name) = LOWER('Shane Brown') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAwISTQBtO7_eEoEDkNWw0NbFAighj9pqkY' )
);
-- Insert: Claire Burke (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recvdw9gyw1Yj3day', 'Claire Burke', NULL, 'https://www.linkedin.com/in/claire-burke-643137a7', 'Business Operations Manager', 'Melbourne, Australia', 'new', NULL, '', NULL, 'Saw the G2 High Performer awards for Firmable. Congrats on the recognition!', 'Hope you''re well! We''re working with some strong GTM Systems candidates at the moment. Happy to chat if useful.', 'I see you''re hiring a GTM Systems Engineer at Firmable. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recvdw9gyw1Yj3day' 
       OR (LOWER(name) = LOWER('Claire Burke') OR linkedin_url = 'https://www.linkedin.com/in/claire-burke-643137a7' )
);
-- Insert: Chloe Frost (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recvipTMhiETvEGd0', 'Chloe Frost', NULL, 'https://www.linkedin.com/in/ACwAAATOy8oBGBIxKGKvs2pKBnzsUUPqxI1fb04', 'Senior Sales Director - APAC, at Info-Tech Research Group', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love seeing the Sydney expansion. Exciting APAC growth!', 'We''re working with some excellent senior account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their APAC scaling phases.', 'Hope you''re settling into the new role well! With Info-Tech''s APAC expansion through Sydney, how are you finding the market for building out account management teams? We''re seeing some interesting shifts in the talent landscape, particularly around senior account management hires in the research and advisory space.', '2025-09-25T04:51:23.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recvipTMhiETvEGd0' 
       OR (LOWER(name) = LOWER('Chloe Frost') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATOy8oBGBIxKGKvs2pKBnzsUUPqxI1fb04' )
);
-- Insert: Eric H. (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recvl3j8ndsB3Icq4', 'Eric H.', NULL, 'https://www.linkedin.com/in/ACwAACgsyr4BJOzWqxWMZ_MYFZNTDfLwRJN6Zbw', 'Regional Sales Manager -APAC', 'Melbourne, Victoria, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Breakthroughs 2025 webinar series. Love the innovation focus!', 'We''re seeing some strong renewals talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out their customer success teams.', 'I see you''re building out your renewals team. How are you finding the local talent market? We''re noticing some interesting shifts around customer success and renewals hires, particularly with companies scaling their Melbourne operations.', '2025-09-30T14:13:39.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recvl3j8ndsB3Icq4' 
       OR (LOWER(name) = LOWER('Eric H.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACgsyr4BJOzWqxWMZ_MYFZNTDfLwRJN6Zbw' )
);
-- Insert: Martin Creighan (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recvwU1AMRhpwL02u', 'Martin Creighan', NULL, 'https://www.linkedin.com/in/ACwAAADNZ3cBsk0mgZhMC0WDWCaE4aB2EoK0yds', 'Vice President Asia Pacific', 'Greater Sydney Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the ANZ Data Readiness report. Great insights on cyber resilience!', 'We''re working with some excellent Strategic Account Executive candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise sales teams.', 'I see you''re building out your team in Victoria. How are you finding the talent market across the region? We''re noticing some interesting shifts around Strategic Account Executive hires in data security, particularly with the increased focus on cyber resilience that your recent research highlighted.', '2025-09-28T14:34:57.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recvwU1AMRhpwL02u' 
       OR (LOWER(name) = LOWER('Martin Creighan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADNZ3cBsk0mgZhMC0WDWCaE4aB2EoK0yds' )
);
-- Insert: Nikolas Kalogirou (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recwAQu0UuRMlUVTY', 'Nikolas Kalogirou', NULL, 'https://www.linkedin.com/in/nikolas-kalogirou', 'Country Manager - Australia/New Zealand', 'Melbourne, Australia', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), 'Saw the Gigamon Insights launch. Love seeing the AI integration with SIEM platforms.', 'We''re working with some strong Regional Sales Directors in cybersecurity at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC teams.', 'I see you''re building out your regional team. How are you finding the cybersecurity sales talent market in APAC? We''re noticing some interesting shifts in the landscape, particularly around senior sales hires in enterprise security.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recwAQu0UuRMlUVTY' 
       OR (LOWER(name) = LOWER('Nikolas Kalogirou') OR linkedin_url = 'https://www.linkedin.com/in/nikolas-kalogirou' )
);
-- Insert: Khalid Khan (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recwFnWC2LdzQKzSF', 'Khalid Khan', NULL, 'https://www.linkedin.com/in/ACwAAAc_7k0B80kgPmCvqMAB3MbT08jGJbbuqZM', 'Senior Customer Success Manager', 'Greater Sydney Area, Australia', 'new', NULL, '', NULL, 'Saw the OnBoard AI launch. Love seeing the new features for board workflows.', 'We''re working with some strong SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in governance tech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recwFnWC2LdzQKzSF' 
       OR (LOWER(name) = LOWER('Khalid Khan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAc_7k0B80kgPmCvqMAB3MbT08jGJbbuqZM' )
);
-- Insert: Neill Wiffin (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recwRKaoPnNqVoP6v', 'Neill Wiffin', NULL, 'https://www.linkedin.com/in/neill-wiffin-4005805', 'Client Director | Strategic Accounts ', 'Melbourne, Australia', 'new', NULL, '', NULL, 'Saw KPMG''s $80M AI investment program announcement. That''s a serious commitment to transformation.', 'Hope you''re well! We''re working with some experienced Salesforce Directors at the moment. Happy to chat if useful.', 'I see KPMG is hiring a Salesforce Director. How''s the search progressing? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recwRKaoPnNqVoP6v' 
       OR (LOWER(name) = LOWER('Neill Wiffin') OR linkedin_url = 'https://www.linkedin.com/in/neill-wiffin-4005805' )
);
-- Insert: Simon Moxham (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recwjSaQQ4IAy2gWu', 'Simon Moxham', NULL, 'https://www.linkedin.com/in/ACwAAATs9EgBdZUiQhancsUrU7ycWwRJdHYLkhE', 'Senior Business Development Manager', 'Greater Perth Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Weir acquisition news. That''s exciting for Perth!', 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams during growth phases.', 'I imagine the Weir acquisition has you thinking about scaling the sales team. How are you finding the talent market in Perth? We''re seeing some interesting shifts around enterprise sales hires in mining tech, especially with all the growth happening locally.', '2025-09-28T04:05:28.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recwjSaQQ4IAy2gWu' 
       OR (LOWER(name) = LOWER('Simon Moxham') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATs9EgBdZUiQhancsUrU7ycWwRJdHYLkhE' )
);
-- Insert: Jack Kruse (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recwsAruTLeNAIASN', 'Jack Kruse', NULL, 'https://www.linkedin.com/in/jack-kruse-24604a88', 'Global Sales Director', 'Melbourne, Australia', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), 'Saw HelloTeams became a Microsoft-certified Operator Connect provider. Congrats on joining that select group!', 'We''re working with some strong Enterprise BDM candidates in the Teams space. Happy to chat if useful.', 'I see you''re hiring Enterprise BDMs at HelloTeams. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recwsAruTLeNAIASN' 
       OR (LOWER(name) = LOWER('Jack Kruse') OR linkedin_url = 'https://www.linkedin.com/in/jack-kruse-24604a88' )
);
-- Insert: Jo Salisbury (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recwuyHcYhpsb39Y2', 'Jo Salisbury', NULL, 'https://www.linkedin.com/in/ACwAAArnDywBY-W_YMJElzFmFMFXDL6E2tPIiAk', 'Director of Sales - APAC', 'Greater Melbourne Area', 'connection_requested', 'High', 'LinkedIn Job Posts', '2025-09-29T01:07:39.767Z', 'Saw the LevelBlue acquisition news. Exciting times for APAC expansion!', 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.', 'Hope you''re well Jo! I see you''re building out your Enterprise AE team. How are you finding the talent market across the region? We''re noticing some interesting shifts around enterprise sales hiring in cybersecurity, particularly with all the consolidation happening. Would love to chat about what we''re seeing in the market if you''re open to it.', '2025-09-28T14:30:47.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recwuyHcYhpsb39Y2' 
       OR (LOWER(name) = LOWER('Jo Salisbury') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAArnDywBY-W_YMJElzFmFMFXDL6E2tPIiAk' )
);
-- Insert: Susan Atike (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recx7Id8RVtrSe7Lp', 'Susan Atike', NULL, 'https://www.linkedin.com/in/susan-atike-a6356711', 'Sales Manager', 'Sydney, Australia', 'new', NULL, '', NULL, 'Congrats on the strategic partnerships with Riyadh Air and LIFT! That''s fantastic news.', 'We''re working with some excellent Account Manager candidates across enterprise software.', 'I see you''re building out your team for Sabre Corporation. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Manager hires in enterprise software.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recx7Id8RVtrSe7Lp' 
       OR (LOWER(name) = LOWER('Susan Atike') OR linkedin_url = 'https://www.linkedin.com/in/susan-atike-a6356711' )
);
-- Insert: Marea Ford (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recxUcOFQtVTC01Nq', 'Marea Ford', NULL, 'https://www.linkedin.com/in/ACwAABAJwk8BTuJfmCiI88ilN9dQ7i3O0_J135o', 'National Sales Manager', 'Greater Brisbane Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the corporate restructure into specialist businesses. Smart move!', 'We''re working with some excellent strategic account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their ANZ teams.', 'I see you''re building out your team. How are you finding the talent market for strategic account roles across the region? We''re noticing some interesting shifts in the market, particularly around senior sales hires in the IT services space.', '2025-09-25T01:34:01.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recxUcOFQtVTC01Nq' 
       OR (LOWER(name) = LOWER('Marea Ford') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABAJwk8BTuJfmCiI88ilN9dQ7i3O0_J135o' )
);
-- Insert: Patrick Amate (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recxWx9vzXLMbFN8L', 'Patrick Amate', NULL, 'https://www.linkedin.com/in/ACwAAAWOCoEBb1BzJ6By4N64erm4kYLFYgu0Iao', 'Government Sales Manager', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the MiClub partnership news. Great local success story!', 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their senior sales teams.', 'I see you''re building out your enterprise sales team. How are you finding the market? We''re noticing some interesting shifts in the talent space, particularly around senior enterprise AE hires in cloud and cybersecurity. With Akamai''s APAC expansion and the growing demand for distributed cloud solutions, there''s definitely some movement happening. Would love to chat about what we''re seeing if you''re open to it.', '2025-09-28T14:38:01.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recxWx9vzXLMbFN8L' 
       OR (LOWER(name) = LOWER('Patrick Amate') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAWOCoEBb1BzJ6By4N64erm4kYLFYgu0Iao' )
);
-- Insert: Emilia Mosiejewski (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recxXDWYLTSMHZOC9', 'Emilia Mosiejewski', NULL, 'https://www.linkedin.com/in/ACwAADDsyU0Bt5aPXIdpLLB3eOhxeT-zvEYnncE', 'Regional Sales Manager (VIC)', 'Melbourne, Australia', 'new', NULL, '', NULL, 'Saw the Zeller for Startups launch. Love seeing the expansion into that space!', 'We''re working with some strong mid-market AE candidates in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.', 'I see you''re building out your team. How are you finding the mid-market AE talent pool? We''re noticing some interesting shifts in the fintech space, particularly around experienced AEs who can handle that segment.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recxXDWYLTSMHZOC9' 
       OR (LOWER(name) = LOWER('Emilia Mosiejewski') OR linkedin_url = 'https://www.linkedin.com/in/ACwAADDsyU0Bt5aPXIdpLLB3eOhxeT-zvEYnncE' )
);
-- Insert: Chelsea Sunderland (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recxhI9cq8igM1kBE', 'Chelsea Sunderland', NULL, 'https://www.linkedin.com/in/ACwAAAyVGeIB97GO5yB9sso-d4yKLPmt_7UKyR4', 'Sales Manager - Existing Business - APAC ', 'Greater Sydney Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the Better by SafetyCulture event in Sydney. That''s exciting!', 'We''re working with some excellent enterprise AE candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.', 'I see you''re building out your enterprise team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent space, particularly around senior AE hires in the SaaS sector. With SafetyCulture''s growth and that 3rd Best Place to Work recognition, you must be seeing strong interest from candidates.', '2025-09-28T14:42:05.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recxhI9cq8igM1kBE' 
       OR (LOWER(name) = LOWER('Chelsea Sunderland') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAyVGeIB97GO5yB9sso-d4yKLPmt_7UKyR4' )
);
-- Insert: Paul Wittich (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recxhnxF9XvYK38nP', 'Paul Wittich', NULL, 'https://www.linkedin.com/in/ACwAAABjOGgBTkUkcQiZvJBsUactAXM7BKor0gg', 'General Manager, APAC', 'Greater Sydney Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love the Sydney office growth as your APAC hub!', 'We''re working with some excellent Account Manager candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC teams.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Manager hires in Sydney, particularly with companies scaling their APAC operations.', '2025-10-01T14:13:19.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recxhnxF9XvYK38nP' 
       OR (LOWER(name) = LOWER('Paul Wittich') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABjOGgBTkUkcQiZvJBsUactAXM7BKor0gg' )
);
-- Insert: Jeffrey Leong (CONNECT SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recxvZuSGjuDwrH32', 'Jeffrey Leong', NULL, 'https://www.linkedin.com/in/ACwAAAC-Fa0BhrzNmohSDxecPWmmJe8_18C1seg', 'Regional Head of Operations ', 'Singapore, Singapore', 'connection_requested', NULL, 'LinkedIn Job Posts', '2025-09-19T05:28:33.864Z', 'Saw the Global Brands Magazine award news. Congrats on Best Digital Payment Solution Provider!', 'We''re working with some strong Sales Manager candidates in payments at the moment. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your team in Melbourne. How are you finding the payments talent market? We''re noticing some interesting shifts in the landscape, particularly around Sales Manager hires in fintech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recxvZuSGjuDwrH32' 
       OR (LOWER(name) = LOWER('Jeffrey Leong') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAC-Fa0BhrzNmohSDxecPWmmJe8_18C1seg' )
);
-- Insert: Laura Robinson (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recxzWxl51HuzL0dK', 'Laura Robinson', NULL, 'https://www.linkedin.com/in/ACwAAAkuEC0B7iQXxb-dGhQ2OtX7AVYipD10t_8', 'Revenue Enablement Manager', 'Brisbane, Queensland, Australia', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Saw the intelliHR rebrand to Humanforce HR. Smart move!', 'We''re working with some excellent presales candidates in the HCM space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their solutions teams.', 'I see you''re building out your presales team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Solutions Consultant hires in Sydney. The move to cloud and unified platform seems to be creating some great opportunities.', '2025-10-01T14:18:16.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recxzWxl51HuzL0dK' 
       OR (LOWER(name) = LOWER('Laura Robinson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAkuEC0B7iQXxb-dGhQ2OtX7AVYipD10t_8' )
);
-- Insert: Mukti Prabhu, GAICD (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recy4yAz2Wq5Y3f3o', 'Mukti Prabhu, GAICD', NULL, 'https://www.linkedin.com/in/muktiprabhu', 'Head of Public sector, Health and Education delivery for Australia and New Zealand', 'Australia', 'new', NULL, '', NULL, 'Saw the Q2 results news. Great to see the strong performance!', 'We''re working with some strong candidates in the tech consulting space.', 'I see you''re hiring for the TMT Service Line Specialist role at Cognizant. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recy4yAz2Wq5Y3f3o' 
       OR (LOWER(name) = LOWER('Mukti Prabhu, GAICD') OR linkedin_url = 'https://www.linkedin.com/in/muktiprabhu' )
);
-- Insert: Matt Perkes (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recyGENWenh0noaE6', 'Matt Perkes', NULL, 'https://www.linkedin.com/in/ACwAAAo41fkBA1mBJRDnAK211cbu31oTQKeju3I', 'Sales Director', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the CloudTech partnership news. Love the Melbourne expansion!', 'We''re working with some excellent enterprise sales candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.', 'I see you''re building out your sales team in Victoria. How are you finding the local talent market? We''re noticing some interesting shifts around enterprise sales hires in fintech, especially with all the momentum Fireblocks has been building locally. The Zerocap partnership and Project Acacia involvement really seem to be opening doors across the region.', '2025-09-21T14:10:15.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recyGENWenh0noaE6' 
       OR (LOWER(name) = LOWER('Matt Perkes') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAo41fkBA1mBJRDnAK211cbu31oTQKeju3I' )
);
-- Insert: Rob Arora (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recyHlYtF43xyzvnz', 'Rob Arora', NULL, 'https://www.linkedin.com/in/ACwAAA4K_R8B4hxf9HttcFkpLDWImCu4S5R_HWc', 'Large Enterprise Account Director', 'Greater Sydney Area', 'new', 'Medium', 'LinkedIn Job Posts', NULL, 'Love seeing Sprinklr''s international expansion focus. Exciting times!', 'We''re working with some excellent enterprise SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales development teams.', 'I see you''re building out your enterprise sales team. How are you finding the market for senior SDR talent? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales development roles in SaaS.', '2025-09-20T14:22:22.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recyHlYtF43xyzvnz' 
       OR (LOWER(name) = LOWER('Rob Arora') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA4K_R8B4hxf9HttcFkpLDWImCu4S5R_HWc' )
);
-- Insert: Tony Walkley (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recyUVSHamGvBpFYI', 'Tony Walkley', NULL, 'https://www.linkedin.com/in/tonywalkley', 'Sales Enablement Manager', 'Adelaide, Australia', 'new', NULL, '', NULL, 'Congrats on being named among the top 30 digital marketing agencies in Sydney for 2025! That''s fantastic recognition.', 'We''re working with some excellent Head of Sales candidates across digital marketing if you''re looking externally.', 'I see you''re building out your team for Zib Digital Australia. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Head of Sales hires in digital marketing.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recyUVSHamGvBpFYI' 
       OR (LOWER(name) = LOWER('Tony Walkley') OR linkedin_url = 'https://www.linkedin.com/in/tonywalkley' )
);
-- Insert: Altay Ayyuce (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recyXi4r9eKUwsjlc', 'Altay Ayyuce', NULL, 'https://www.linkedin.com/in/ACwAAAJ7z4AB4W-UAe3qALVwshm3r1SLwVEtbZ8', 'Area Vice President, ANZ', 'Greater Melbourne Area', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Melbourne SDR role posting. Exciting local growth!', 'We''re working with some excellent SDR candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in competitive markets.', 'I see you''re building out your sales team. How are you finding the local talent market? We''re noticing some interesting shifts around experienced SDR hires in Melbourne, particularly with the demand for 3+ years enterprise experience that seems to be the new standard.', '2025-09-20T14:12:39.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recyXi4r9eKUwsjlc' 
       OR (LOWER(name) = LOWER('Altay Ayyuce') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAJ7z4AB4W-UAe3qALVwshm3r1SLwVEtbZ8' )
);
-- Insert: Sarah Jarman (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recybZzn3lZjl04Z6', 'Sarah Jarman', NULL, 'https://www.linkedin.com/in/ACwAADBXEFUBIeEdfQjPkp1MWp2yCUJ7xf3j0zI', 'Sales Director, APJ - ANZ', 'Melbourne, Victoria, Australia', 'messaged', 'High', 'LinkedIn Job Posts', '2025-09-23T06:53:53.232Z', 'Saw the Sydney office expansion at Australia Square. Exciting growth!', 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases.', 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Executive hires in Sydney, especially with all the growth happening in cybersecurity right now.', '2025-09-22T14:21:31.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recybZzn3lZjl04Z6' 
       OR (LOWER(name) = LOWER('Sarah Jarman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAADBXEFUBIeEdfQjPkp1MWp2yCUJ7xf3j0zI' )
);
-- Insert: Shane Lowe (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recyeFdD4na10NVPi', 'Shane Lowe', NULL, 'https://www.linkedin.com/in/shane-lowe-64204455', 'Head of Strategic Partnerships, APAC', 'Sydney, Australia', 'new', NULL, '', NULL, 'Love seeing the strategic partnerships with Riyadh Air and LIFT! Must be an exciting time in your role.', 'We''re working with some excellent Account Manager candidates across enterprise software if you''re looking externally.', 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Manager hires in enterprise software.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recyeFdD4na10NVPi' 
       OR (LOWER(name) = LOWER('Shane Lowe') OR linkedin_url = 'https://www.linkedin.com/in/shane-lowe-64204455' )
);
-- Insert: James Demetrios (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recysBAWEGQQD2rUg', 'James Demetrios', NULL, 'https://www.linkedin.com/in/james-demetrios-596096b0', 'Director of Sales', 'Bendigo, Australia', 'new', NULL, '', NULL, 'Saw the Series G news. $450M is massive - congrats!', 'We''re working with some experienced Sales Development talent in Sydney at the moment.', 'I see you''re hiring a Sales Development Manager at Rippling. How are you finding the Sydney market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recysBAWEGQQD2rUg' 
       OR (LOWER(name) = LOWER('James Demetrios') OR linkedin_url = 'https://www.linkedin.com/in/james-demetrios-596096b0' )
);
-- Insert: Ravi Chandar (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recz6q1ijSZaF9VBU', 'Ravi Chandar', NULL, 'https://www.linkedin.com/in/ravichandar', 'Director, Regional Sales', 'Melbourne, Australia', 'new', NULL, '', NULL, 'Saw the Microsoft partnership news. Great move for Netskope!', 'Hope you''re well! We''re working with some strong CSM candidates in cybersecurity. Happy to chat if useful.', 'I see you''re hiring CSMs at Netskope. How are you finding the market? We work with companies like HubSpot on similar roles.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recz6q1ijSZaF9VBU' 
       OR (LOWER(name) = LOWER('Ravi Chandar') OR linkedin_url = 'https://www.linkedin.com/in/ravichandar' )
);
-- Insert: Damon Etherington (MSG SENT)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reczBj20GjXPpN3Lr', 'Damon Etherington', NULL, 'https://www.linkedin.com/in/ACwAAAKVNDcBG892ycvxNPP-_gIBDQUZcO0mVMs', 'Head of Enterprise, ANZ', 'Greater Sydney Area, Australia', 'messaged', 'High', 'LinkedIn Job Posts', '2025-09-21T23:33:17.006Z', 'Saw the platform upgrade news with the new AI features. Love seeing the innovation at Contentsquare.', 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in analytics and SaaS.', '2025-09-17T14:19:37.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reczBj20GjXPpN3Lr' 
       OR (LOWER(name) = LOWER('Damon Etherington') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKVNDcBG892ycvxNPP-_gIBDQUZcO0mVMs' )
);
-- Insert: Paul Broughton (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reczFh7JbA60aFiX0', 'Paul Broughton', NULL, 'https://www.linkedin.com/in/ACwAAAD887EBrT2xyWideBuXvcWwwp0jTEoYcbA', 'Senior Vice President & Managing Director - Asia Pacific & Japan', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love that you''re anchoring APAC operations from Sydney. Great base for the region!', 'We''re working with some excellent BDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their regional teams.', 'I see you''re building out your BDR team. How are you finding the talent market across the region? We''re noticing some interesting shifts in the landscape, particularly around business development hires in HR tech. The demand for quality BDRs who understand the APAC market dynamics has been pretty strong lately.', '2025-09-20T06:24:19.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reczFh7JbA60aFiX0' 
       OR (LOWER(name) = LOWER('Paul Broughton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAD887EBrT2xyWideBuXvcWwwp0jTEoYcbA' )
);
-- Insert: Andrew McCarthy (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reczGPRI3ksBCfbks', 'Andrew McCarthy', NULL, 'https://www.linkedin.com/in/ACwAAAP2OIEBhvmsGs4CE-6xJ22XbVoQB91JuM8', 'GM of ANZ, SEA and India', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Sydney headquarters launch. Exciting local expansion!', 'We''re working with some excellent sales managers in the Sydney market at the moment. Companies like HubSpot and Docusign have found our approach helpful during these rapid scaling phases.', 'I see you''re building out the team there. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around sales manager hires in Sydney. With plans to double the team, I imagine you''re seeing the competition firsthand.', '2025-09-25T22:27:29.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reczGPRI3ksBCfbks' 
       OR (LOWER(name) = LOWER('Andrew McCarthy') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAP2OIEBhvmsGs4CE-6xJ22XbVoQB91JuM8' )
);
-- Insert: Lewis Steere (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reczaCr3uNwf2fmrD', 'Lewis Steere', NULL, 'https://www.linkedin.com/in/ACwAACE3Ry4B4IYhJz2Cv54qnuQo4qw_IY2Ieso', 'State Manager - Victoria', 'Greater Melbourne Area, Australia', 'new', NULL, '', NULL, 'Saw the Square partnership news. Great move for venue operators!', 'We''re working with some strong Business Development candidates in hospitality tech at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.', 'I see you''re building out your team. How are you finding the hospitality tech talent market? We''re noticing some interesting shifts in the landscape, particularly around Business Development hires in food tech.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reczaCr3uNwf2fmrD' 
       OR (LOWER(name) = LOWER('Lewis Steere') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACE3Ry4B4IYhJz2Cv54qnuQo4qw_IY2Ieso' )
);
-- Insert: Pat Bolster (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reczcYGAJWd0EqR4G', 'Pat Bolster', NULL, 'https://www.linkedin.com/in/ACwAAAIzlQEBbRKtxGd4t4-JIMxf1JH2hiE4BWc', 'Managing Director Australia', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Love seeing the Sydney team expansion. That''s exciting growth!', 'We''re working with some excellent BDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.', 'I see you''re building out your team in Sydney. How are you finding the local talent market? We''re noticing some interesting shifts around BDR hires in fintech, particularly with the growth happening in Barangaroo.', '2025-09-20T06:34:38.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reczcYGAJWd0EqR4G' 
       OR (LOWER(name) = LOWER('Pat Bolster') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAIzlQEBbRKtxGd4t4-JIMxf1JH2hiE4BWc' )
);
-- Insert: Brett Waters (IN QUEUE)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reczel0ew6m0BWo9c', 'Brett Waters', NULL, 'https://www.linkedin.com/in/muddywaters', 'MD APAC', 'Randwick, Australia', 'in queue', NULL, 'LinkedIn Job Posts', NOW(), 'Saw the CopadoCon India success. Love seeing that growth in the region!', 'We''re working with some strong BDR candidates in the Salesforce ecosystem. Companies like HubSpot and Docusign have found our approach helpful.', 'I see you''re building out your BDR team. How are you finding the Salesforce talent market? We''re noticing some interesting shifts in the landscape, particularly around BDR hires in the DevOps space.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reczel0ew6m0BWo9c' 
       OR (LOWER(name) = LOWER('Brett Waters') OR linkedin_url = 'https://www.linkedin.com/in/muddywaters' )
);
-- Insert: Ki Currie (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recziU0VUxmZa9oBu', 'Ki Currie', NULL, 'https://www.linkedin.com/in/ACwAABUA8IIBMS9dHI4yCdaRcyDvzwf7guhYwqI', 'APAC Commercial Sales Manager', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Anacle acquisition news. Exciting APAC expansion!', 'We''re working with some excellent account management candidates at the moment, particularly those with proptech and SaaS experience. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams in this market.', 'Hope you''re well Ki! I see MRI''s really scaling up the APAC operations with the recent acquisition and Melbourne office growth. How are you finding the market as you build out the account management team? We''re seeing some interesting shifts in the talent landscape, particularly around enterprise sales hires in proptech. The demand for experienced account managers who understand both residential and commercial property tech is definitely heating up.', '2025-09-21T14:12:55.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recziU0VUxmZa9oBu' 
       OR (LOWER(name) = LOWER('Ki Currie') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABUA8IIBMS9dHI4yCdaRcyDvzwf7guhYwqI' )
);
-- Insert: Gavin James Vermaas (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reczj7M20lbjxhCYh', 'Gavin James Vermaas', NULL, 'https://www.linkedin.com/in/ACwAAACCn8ABF1GLONyPMwmeaszSP_tkM3_1UMY', 'GRC Solution Sales Director', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Diligent Connections 2025 event in Sydney. Exciting times!', 'We''re working with some excellent BDR candidates in the GRC space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their business development teams.', 'Hope you''re well Gavin! I see you''re in the BDR space at Diligent. How are you finding the market for GRC talent in Sydney? We''re noticing some interesting shifts in the talent landscape, particularly around business development hires in the compliance and governance space. The AI focus at your upcoming February event suggests some exciting growth ahead.', '2025-09-20T06:37:02.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reczj7M20lbjxhCYh' 
       OR (LOWER(name) = LOWER('Gavin James Vermaas') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACCn8ABF1GLONyPMwmeaszSP_tkM3_1UMY' )
);
-- Insert: Ashutosh Razdan (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'recztVMs8FF6mKhQj', 'Ashutosh Razdan', NULL, 'https://www.linkedin.com/in/ashutosh-razdan-4718a74', 'Director and Sector Lead for Energy, Utilities and Resources -ANZ', 'Melbourne, Australia', 'new', NULL, '', NULL, 'Congrats on HCLTech being recognised as Dell Technologies'' 2025 Global Alliances AI Partner of the Year! That''s fantastic news.', 'We''re working with some excellent Sales Director candidates across enterprise software if you''re looking externally.', 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in enterprise software.', '2025-09-17T02:09:32.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'recztVMs8FF6mKhQj' 
       OR (LOWER(name) = LOWER('Ashutosh Razdan') OR linkedin_url = 'https://www.linkedin.com/in/ashutosh-razdan-4718a74' )
);
-- Insert: Tim Bentley (NEW LEAD)
INSERT INTO people (airtable_id, name, email_address, linkedin_url, company_role, employee_location, stage, confidence_level, lead_source, automation_started_at, linkedin_request_message, linkedin_follow_up_message, linkedin_connected_message, created_at, updated_at)
SELECT 'reczzKeY3kebF8lzD', 'Tim Bentley', NULL, 'https://www.linkedin.com/in/ACwAAACafEQBBT8hVHbuJIxI3c1Uesg3Zxs0rP8', 'VP APJ', 'Sydney, New South Wales, Australia', 'new', 'High', 'LinkedIn Job Posts', NULL, 'Saw the Singapore partnership news. Exciting APAC expansion!', 'We''re working with some excellent mid market AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their regional scaling phases.', 'I see you''re building out your team. How are you finding the talent market across the region? We''re noticing some interesting shifts in the landscape, particularly around mid market AE hires in cybersecurity. The APAC expansion must be opening up some great opportunities.', '2025-09-28T04:11:18.000Z', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE airtable_id = 'reczzKeY3kebF8lzD' 
       OR (LOWER(name) = LOWER('Tim Bentley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACafEQBBT8hVHbuJIxI3c1Uesg3Zxs0rP8' )
);