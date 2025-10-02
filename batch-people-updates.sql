-- BATCH UPDATE ALL PEOPLE FROM AIRTABLE

-- Generated: 2025-10-02T03:05:29.081Z

-- Total people to process: 505



-- UPDATE EXISTING PEOPLE RECORDS

UPDATE people SET 
    airtable_id = 'rec00K14ZaDrRx7L1',
    company_role = 'Sales Manager',
    employee_location = 'Australia',
    stage = 'connection_requested',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing Nothing''s 146% growth in India. That''s incredible momentum.',
    linkedin_follow_up_message = 'We''re working with some strong sales leaders in the ANZ market at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Sales Lead for ANZ at Nothing. How are you finding it with all the expansion happening? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Collection mohit') OR linkedin_url = 'https://www.linkedin.com/in/collection-mohit-82ba96363')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec0OJCtqkanR0vxY',
    company_role = 'RVP Sales - APJ ',
    employee_location = 'Greater Sydney Area',
    stage = 'connected',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the iPX Sydney event news. That''s exciting growth!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Executive hires in Sydney, particularly with companies scaling their partnership teams like impact.com is doing.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Emma-Jayne Owens') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA1jxUoB8W7J34scDcXBGbzb5Xl7wRASflk')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec0QFvn5fa8ZcC7y',
    company_role = 'Lead Account Manager - Financial Services',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = 'Low',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw Simplus featured at the Agentforce World Tour. Great to see you leading the AI transformation space.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Presales candidates in the Salesforce space. Happy to chat if useful.',
    linkedin_connected_message = 'I see the team is hiring a Presales Executive at Simplus. How''s the market looking? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('David Phillips') OR linkedin_url = 'https://www.linkedin.com/in/david-phillips-a6017315')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec0kSyo4N7LWp7uS',
    company_role = 'Enterprise Strategic Sales ',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing SUGCON ANZ coming to Sydney. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates focused on new business development at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their ANZ teams.',
    linkedin_connected_message = 'I see you''re building out your SDR team for ANZ new business. How are you finding the talent market in Sydney? We''re noticing some interesting shifts around SDR hiring, particularly with companies expanding their ANZ presence like Sitecore is doing with events like SUGCON.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Cameron Fenley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABMPCwBwtvgbuWS1nwCKDbwXWXM3Dtn4CI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec0kd22pifT1Midg',
    company_role = 'Subcontractor Sales Manager',
    employee_location = 'Greensborough, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Great to connect Stephanie! Love seeing the growth at E1 across the APAC region.',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates across enterprise software.',
    linkedin_connected_message = 'I see you''re building out your team for E1. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in enterprise software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Stephanie French') OR linkedin_url = 'https://www.linkedin.com/in/stephanie-jayne-french')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec0koPZSD5QJ1bFe',
    company_role = 'Head of Sales ANZ',
    employee_location = 'Australia',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the GBG Go platform launch. Exciting move with the rebrand!',
    linkedin_follow_up_message = 'We''re working with some excellent senior account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their ANZ operations.',
    linkedin_connected_message = 'I see you''re building out your ANZ team. How are you finding the market for senior account management talent? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales hires in the identity verification space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Anne-Sophie Purtell') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABBLFcoB4kjxzEw-7FhKBEL5DT5YEriMrQk')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec0qQAnW80XI17ko',
    company_role = 'Sales Director',
    employee_location = 'Perth, Western Australia, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the new Melbourne office fit out. Great investment in the team!',
    linkedin_follow_up_message = 'We''re working with some excellent BD candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team with the Business Development Director role. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around BD hires in Melbourne''s tech sector.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Warren Reid') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAITVkkBHrOao1Ug57X0mrS78RCvA1BBXok')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec12qIgXB6vOTdsP',
    company_role = 'Regional Sales Manager',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the Melbourne office presence. Smart local move!',
    linkedin_follow_up_message = 'We''re seeing some strong customer success talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their renewals teams.',
    linkedin_connected_message = 'Hope you''re settling in well at Lumivero! I see you''re building out the renewals team. How are you finding the local talent market? We''re noticing some interesting shifts in the customer success landscape, particularly around renewals manager hires in the data analytics space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Martin Evans') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAfOYRkB36BcMY5G7qNc7Y1SIVAa7NFISkM')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec1M3yBI49uSQTGT',
    company_role = 'Regional Vice President, Strategic | Enterprise ANZ at Elastic',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Tech Data partnership announcement. Great move for ANZ!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AEs with government experience at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their public sector teams.',
    linkedin_connected_message = 'I see you''re building out your federal government team. How are you finding the talent market for enterprise AEs in that space? We''re noticing some interesting shifts around government sector sales hiring, particularly with companies expanding their public sector focus.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Nick Bowden') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAASE0GwBUTqx4FSOSdFRRRxeCATs7hyPi6M')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec1NpANJAnAPPojx',
    company_role = 'Vice President of Sales, Asia',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new Sydney office at Australia Square. That''s exciting growth!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in cybersecurity. The demand for experienced AEs who can navigate complex enterprise sales cycles has really picked up lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Sumit Bansal') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAD1-4Bv2H3r1qIqN3e8o1YLI2l5S_zaQ8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec1OBrIhuK084uFV',
    company_role = 'Country Manager, Australia & New Zealand',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the AI platform launches at Birdeye. Love seeing the innovation in hyperlocal marketing.',
    linkedin_follow_up_message = 'We''re working with some strong SDR candidates in the AI space at the moment. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in AI and marketing tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Brendan Irwin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABB8F40BVkrydHCArjZg8jbmcObPWculdeQ')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec1evCimTBK0iOGL',
    company_role = 'Vice President, AsiaPacific and Japan',
    employee_location = 'Singapore',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Nueva partnership announcement. Great move expanding in Sydney!',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AE candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during local expansion phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in Sydney. With all the partnership activity and the Xcelerate event coming up, must be an exciting time to be scaling locally. I run Launchpad, APAC''s largest invite-only GTM leader community, and also help companies like yours build exceptional teams through 4Twenty Consulting. Would love to chat about what we''re seeing in the market.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Nicola Gerber') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABQq6MBZVWnEzmK0yv9eztk4sqdrwGrToA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec1hqDZyU1fwF7wj',
    company_role = 'Senior Sales Director - APAC, at Info-Tech Research Group',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love what Info-Tech is doing across APAC. Hope you''re well!',
    linkedin_follow_up_message = 'We''re working with some excellent account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their client-facing teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the talent market across the region? We''re noticing some interesting shifts around account management hires in IT services, particularly with the demand for digital transformation expertise.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Chloe Frost') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATOy8oBGBIxKGKvs2pKBnzsUUPqxI1fb04')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec1lVxqstS6qCJyj',
    company_role = 'Senior Manager',
    employee_location = 'Greater Melbourne Area',
    stage = 'in queue',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing Nightingale''s success with Victorian care providers!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates who understand the care sector at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in regulated industries.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market for BDR talent in the care management space? We''re noticing some interesting shifts in the talent market, particularly around sales roles in the NDIS and aged care sectors. The regulatory changes seem to be driving a lot of demand for platforms like yours.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ryan Joseph Rialp') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACJ6uycBCpbyzgJntKJOIKEOtPHYnno1LXs')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec1mOrlAay4bo519',
    company_role = 'Head of Business Development - Australia & New Zealand',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about the $1 billion Series K. Congrats on the massive milestone!',
    linkedin_follow_up_message = 'We''re working with some strong Engagement Manager candidates with consulting backgrounds.',
    linkedin_connected_message = 'I see you''re hiring an Engagement Manager in Sydney at Databricks. How are you finding it with all the growth? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Christina Chung') OR linkedin_url = 'https://www.linkedin.com/in/christina-chung')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec1rEmTGHA8l4ypj',
    company_role = 'Sales Director',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the platform updates for the Aged Care Bill changes. Smart move getting ahead of July 2025.',
    linkedin_follow_up_message = 'We''re working with some strong BDR candidates in healthcare tech at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the aged care tech market? We''re noticing some interesting shifts in the talent landscape, particularly around BDR hires in healthcare software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jordan K.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATy2SQBPzgGAyPa95PZxVbr_8UIedh-a7M')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec1sriUFAMAjIY1p',
    company_role = 'Director of GTM - Enterprise',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $27.5M Series A news. That''s exciting growth!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams quickly.',
    linkedin_connected_message = 'I see you''re building out your SDR team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent landscape, particularly around sales development hires in the construction tech space. With your team doubling from 70 to 140 people, I imagine you''re seeing the challenges firsthand. Would love to chat about what we''re seeing in the market.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Daniel Corridon') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABBxrngBGEbkNtq6m9iih8UN7r0XG6R7sdo')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec1zDHjb3DIvNsqs',
    company_role = 'Vice President, Asia Pacific, India, Japan & China',
    employee_location = 'Balgowlah Heights, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Australian data residency launch. That''s huge for enterprise!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.',
    linkedin_connected_message = 'I see you''re building out your enterprise team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales hires in the tech sector. The data residency launch must be opening up some exciting opportunities with regulated industries.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Sharryn Napier (She/Her)') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABBiewBkXeaLKsSk49j4wmiGc3DeZqZMfU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec1zg6dNH94IPduv',
    company_role = 'Head of Strategy & Business Development',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Clever AI Data Analyst launch in Sydney. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent technical sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during product launch phases.',
    linkedin_connected_message = 'Hope you''re well Chris! I see you''re building out your sales team. How are you finding the local talent market? We''re noticing some interesting shifts in the fintech space, particularly around technical sales hires with your new AI product launch. I run Launchpad, APAC''s largest invite-only GTM leader community, and also help companies like yours scale their sales teams through 4Twenty Consulting. Would love to chat about what we''re seeing in the market.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Chris Haylock') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAzhbMBH8Iy2y3097UEVhbWdKiokK5or6A')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec1zoRpvOVDSxxMx',
    company_role = 'Global Sales Leader - Emerging Regions / APAC',
    employee_location = 'Sydney, Australia',
    stage = 'in queue',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Forrester Wave recognition. Congrats on being named a Leader!',
    linkedin_follow_up_message = 'We''re working with some solid partner sales candidates across APAC. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Partner Sales Manager ANZ at Atlassian. How are you finding the market? We work with companies like HubSpot on similar partner roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jothi Kumar') OR linkedin_url = 'https://www.linkedin.com/in/jothikumar79')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec21j6M2JF4v640k',
    company_role = 'Vice President and Business Unit Head for Diversified Industries HCL ANZ',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on HCLTech being recognised as Dell Technologies'' 2025 Global Alliances AI Partner of the Year! That''s fantastic news.',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Director candidates across enterprise software if you''re looking externally.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in enterprise software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Bharani Iyer') OR linkedin_url = 'https://www.linkedin.com/in/bharani-iyer-74335a1')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec2HdUTDiLfyeGdO',
    company_role = 'Director of GTM Operations',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $27.5M Series A news. That''s exciting growth!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases like yours.',
    linkedin_connected_message = 'I see you''re building out your SDR team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent landscape, particularly around sales development hires in the construction tech space. With Sitemate doubling the team locally, I imagine you''re seeing the competition for quality SDRs firsthand.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Adriana De Souza') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA6MOgYBhmR8sBQsZP51f4zuWG5S3AKbZM4')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec2YeOIJ3zn0fUMm',
    company_role = 'Regional Sales Director',
    employee_location = 'Sydney, Australia',
    stage = 'in queue',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about your CRM hitting $100M run rate. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some strong SDR Manager candidates at the moment.',
    linkedin_connected_message = 'I see you''re hiring an SDR Manager at monday.com. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Andrew Fogarty') OR linkedin_url = 'https://www.linkedin.com/in/andrew-fogarty-30a50616')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec2d48SihMgn9YpE',
    company_role = 'Country Manager, Singapore and Asia',
    employee_location = 'Singapore',
    stage = 'in queue',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the ESET Connect 2025 launch. Love the partner enablement focus!',
    linkedin_follow_up_message = 'We''re working with some excellent channel sales professionals at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their partner programs.',
    linkedin_connected_message = 'I see you''re building out your channel team. How are you finding the talent market for channel sales roles? We''re noticing some interesting shifts in the market, particularly around experienced channel account managers who understand both the technical and relationship sides of cybersecurity partnerships.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Pamela Ong') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA7fXHMBV3-4aX6TzAEMzoUT5hp76T_3zYQQ')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec2kkHX0gKQ4fXC7',
    company_role = 'Country Lead',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Nueva partnership announcement. Great move for the Sydney market!',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AE candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in Sydney. With all the partnership activity and growth happening at Fastly locally, I imagine you''re seeing increased demand for top performers.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Peter Scott') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABxsBr0BgdzzgxhrmBZaXkisQrQ6kqdOLVA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec3Ad9QAqMUTScTf',
    company_role = 'Senior General Manager - Business Sales (Australia & NZ)',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new warranty launch for the Arizona printers. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out their sales teams.',
    linkedin_connected_message = 'I see Canon''s been expanding the Melbourne team lately. How are you finding the local talent market? We''re noticing some interesting shifts around enterprise sales hires, particularly with companies scaling their production printing divisions. The market''s been quite active for AE roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ben Luke') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAgVxQcBmjd5aASGoXWgSi6eqNRYGqlPnAA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec3RqQ4jP82lbaGz',
    company_role = 'Strategic Sales Director',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Melbourne office launch! Exciting move into APAC.',
    linkedin_follow_up_message = 'We''re working with some excellent sales talent in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC operations.',
    linkedin_connected_message = 'Hope you''re settling in well with the new Melbourne office setup! How are you finding the local talent market as you build out the team? We''re seeing some interesting shifts around sales director and AE hires in the region, particularly with US companies expanding their APAC presence.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Joe Widing') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA9XAa4B7EqiXQUQpM4HnNUis0xM2_jb0so')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec40mD2H9KCU0gAV',
    company_role = 'Sales Director',
    employee_location = 'Brisbane, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Microsoft Edge reporting connector launch. That''s exciting progress with the partnerships.',
    linkedin_follow_up_message = 'We''re working with some strong Solutions Engineers in the cybersecurity space.',
    linkedin_connected_message = 'I see you''re hiring Solutions Engineers at Devicie. How are you finding it with the team expansion? We work with companies like HubSpot on similar technical roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Mike Hawley') OR linkedin_url = 'https://www.linkedin.com/in/devicie')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec44Gkgf3MFl7oDt',
    company_role = 'Enterprise Sales Manager',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing JustCo''s Sydney expansion with King Street and Pitt Street!',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Executive candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in competitive markets.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the talent market in Sydney? We''re noticing some interesting shifts around Sales Executive hires in the coworking space, particularly with companies scaling their enterprise solutions like JustCo.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Charlotte Buxton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAtZsYgBHap28_PCkeYpoWUf5Cn2X9W7PlE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec44K9sjaC3bD2V0',
    company_role = 'General Manager, Greater China',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Top Global Consumer Trends 2025 whitepaper. Great insights on changing market dynamics.',
    linkedin_follow_up_message = 'We''re working with some strong Business Development candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Business Development hires in data and insights companies.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Julia Ren') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADh_D0BNBHCUg4PhpfLENYwiBmXx__Gd4A')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec47pVJsMkXTGu2d',
    company_role = 'Senior Sales Manager, Rocket Software',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the COBOL Day Sydney event. Great local engagement!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Executive hires in Sydney, especially with all the enterprise modernisation activity happening.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Lawrence Tso') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAqqoboBrfkUw34a8QY7yN-j2WrcMwEV2VI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec4RI186zcGpWoGT',
    company_role = 'Senior Director, JAPAC [Corporate Sales] SMB + Mid Market',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the data residency launch in Australia. Big win for enterprises!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AEs at the moment who understand the regulated sector well. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.',
    linkedin_connected_message = 'Hope you''re well Ross! The data residency launch must be opening up some serious conversations with regulated enterprises. How are you finding the response from banking and government prospects? We''re seeing a lot of movement in enterprise sales teams as companies gear up for these compliance-driven opportunities. The shift toward local cloud deployment is creating some interesting hiring patterns across the market.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ross F.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA0-WuEBXO7QWVqrHhZ4M-AZoRGTqK7ymDQ')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec4Relc9xy8sSDpP',
    company_role = 'Mid Market Account Executive',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the BoxWorks AI launch news. Love seeing the strategic shift to AI automation.',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your Enterprise AE team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Rheniel Ibalio') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAzJKloBvrV5a623LPRHbs6_FSEgvwRYUew')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec4SBW8m2Mi4yFjs',
    company_role = 'Sales Operations Team Lead',
    employee_location = 'Greater Brisbane Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the AI-powered LMS updates. Great innovation!',
    linkedin_follow_up_message = 'We''re working with some excellent B2B sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around B2B sales hires in edtech. The demand for people who understand both SaaS sales and the education sector seems to be really picking up in Brisbane.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Natasha Pennells') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAk3d34BQkLx9HB_l1nwazHOwj8zNZb2Dp0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec4bXgbw2X1qTZRL',
    company_role = 'Head of Enterprise Sales ANZ',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Stripe Tour Sydney event. That Stripe Capital launch looks exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams in this market.',
    linkedin_connected_message = 'Hope you''re settling in well at Stripe! I see you''re building out the SDR team. How are you finding the local talent market? We''re noticing some interesting shifts in the market, particularly around SDR hires in fintech. The growth you''re seeing with over a million users locally must be creating some exciting opportunities.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Myron Stein') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAZIOwEB2WvSyiTux-O-rFO3nDXu-Gvqnos')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec4hc6wNFQQXaX7V',
    company_role = 'SVP & Managing Director (Schneider Elec Company)',
    employee_location = 'Brisbane, Queensland, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the WestConnex and Sydney Metro wins. Impressive local growth!',
    linkedin_follow_up_message = 'We''re working with some excellent sales talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC teams.',
    linkedin_connected_message = 'I see you''re building out your team across APAC. How are you finding the local talent market? We''re noticing some interesting shifts in the sales landscape, particularly around enterprise sales hires in Sydney. The infrastructure tech space seems to be heating up with all the major projects happening.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Chris Smith') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABm6ASEBzzBzDZ_yvRylPSt2GwsT-fZzyig')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec4scUKzjZ3jLifP',
    company_role = 'Area Vice President, ANZ',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Proofpoint Protect Tour in Sydney. Great inaugural event!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates in the cybersecurity space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their business development teams.',
    linkedin_connected_message = 'I see you''re building out your BDR team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around business development hires in cybersecurity. The demand for quality BDRs who understand the security space has really picked up since your Sydney event.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Crispin Kerr') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABTqNsBl_XPBoNJeSKyvLMlvefUr6L6hKY')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec5GbWrYQysZNviw',
    company_role = 'RVP - Regional Vice President, ANZ',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney partner bootcamps. Great local expansion!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Executive candidates in the identity security space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise sales teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent market, particularly around Account Executive hires in identity security. The demand for experienced AEs who understand enterprise cybersecurity is really heating up in Sydney.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('James Ross') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABYri0B4I-oxo8ZDk1JZfJ7jLr04ssQO3I')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec5L4zgPoF9LgclG',
    company_role = 'Director of Partner Connect APAC',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw MRI''s Melbourne hiring push. Exciting growth phase!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams during growth phases like this.',
    linkedin_connected_message = 'I see you''re building out the sales team in Melbourne. How are you finding the local talent market? We''re noticing some interesting shifts around Account Manager and sales hires in proptech, especially with all the APAC expansion happening. The Anacle acquisition seems to be driving some serious growth momentum across the region.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Steve Grubmier') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAo2lo0BPOe8g0ui3dmfbZovRdes1vmCeDM')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec5ORnkmQy4WQxyy',
    company_role = 'Senior Client Executive',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Toustone acquisition news. Great move expanding into data analytics!',
    linkedin_follow_up_message = 'We''re working with some excellent sales professionals in the resources tech sector at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around sales hires in the mining and resources tech space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Matt Davison') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAfKVC0BSk2eB6jmnlN_gjKX3Zv91odoDk4')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec5SLGtXoTU7ohh5',
    company_role = 'Sales Manager',
    employee_location = 'Greater Brisbane Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the SUGCON ANZ 2025 news. Sydney''s going to be buzzing!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their ANZ teams.',
    linkedin_connected_message = 'I see you''re focused on new business across ANZ. How are you finding the market at the moment? We''re noticing some interesting shifts in the talent space, particularly around SDR hires in the tech sector. With events like SUGCON coming up, there seems to be renewed energy in the local market.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Greg Baxter') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACtdcYBhlO8gs2rAxPPi2sJ1Rf-ruf2Q70')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec5g7FeTjD7aCmH5',
    company_role = 'Managing Director - APAC',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Australia Square Plaza office setup. Great Sydney base!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in the employee engagement space at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out their Sydney teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Executive hires in the employee engagement space, particularly with companies scaling their Sydney operations.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Kylie Green') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAqg3lMBsYSUyVow2jTs08Rd2LNJqr6Ytuw')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec66RaPyoqSHx05F',
    company_role = 'Global Head of Sales',
    employee_location = 'Gold Coast, Queensland, Australia',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney customer event news. Love the local focus!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your BDR team. How are you finding the local talent market? We''re noticing some interesting shifts around sales development hiring in Sydney, particularly with the infrastructure boom happening across NSW.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Trent McCreanor') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABAtl1sBKMWjbLJW05P3pX_vznUl-AFj5UI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec69HmRrMRNvDwJV',
    company_role = 'Senior Inside Sales Manager',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the Sydney CBD expansion. King Street and Pitt Street locations look great!',
    linkedin_follow_up_message = 'We''re working with some excellent sales executives at the moment who have strong coworking and flexible workspace experience. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent landscape, particularly around sales executive hires in the coworking space. The demand for experienced sales professionals who understand flexible workspace solutions has really picked up.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jonathan Chua') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABsOXUsB-1py8q8LNvzMdsvxTc-YF4VXtsg')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec69wC19ZPRYDVcb',
    company_role = 'Sales Director, APAC',
    employee_location = 'Melbourne, Australia',
    stage = 'in queue',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about Planful''s record bookings in 2024. That''s exciting growth!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the SDR market with all the expansion happening? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in SaaS companies scaling globally.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jordan Akers') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABGMQscBBGeZZ8BYa_-lS4sTEjvzRKafm7k')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec6G7Ge7E71rN2P7',
    company_role = 'Sales Director',
    employee_location = 'Manly West, Queensland, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new board appointments and restructure. Great to see Xref moving forward strong.',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the SDR market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in HR tech and SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jonathan Mathers') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAxyRmcBVUhXPlThfi0RzWXoodZD0OFpME4')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec6RoukZ1l5LM40z',
    company_role = 'Major Account Executive FSI & Critical Infrastructure',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the MiClub partnership news. Great work in the local market!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.',
    linkedin_connected_message = 'I see you''re building out your enterprise sales team. How are you finding the talent market for senior AE hires? We''re noticing some interesting shifts in the market, particularly around enterprise sales talent with cloud infrastructure experience.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Daniel Lawrence') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAGaZLUBshsiFpzXx7PoBY_X2j-S_NGpIEA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec6dod4hTQTj5MRQ',
    company_role = 'Enterprise Sales Manager',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the Sydney CBD expansion. Great locations!',
    linkedin_follow_up_message = 'We''re working with some excellent sales executives at the moment who understand the coworking market well. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the landscape, particularly around sales executive hires in the coworking space. The competition for quality sales talent has definitely ramped up with all the flexible workspace growth happening locally.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Polly Parker') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAdR2UYBf976d6piwzdm_lU8vcJpGsiKuO0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec6qLkHfUpNxIz68',
    company_role = 'Director of Channel Partnerships - Australia',
    employee_location = 'North Sydney, New South Wales, Australia',
    stage = 'in queue',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Gartner recognition for ESET. Great achievement!',
    linkedin_follow_up_message = 'We''re working with some excellent channel sales professionals at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their partner ecosystems.',
    linkedin_connected_message = 'Hope you''re well Eric! I see you''re building out your channel sales team. How are you finding the local talent market in North Sydney? We''re noticing some interesting shifts in the market, particularly around channel sales hires in cybersecurity. With ESET''s recent growth and the new training platform launch, I imagine you''re seeing strong demand for experienced channel professionals.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Eric Rollett') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAB-eTABP-Rtrl-CBifx9QYSK5veSL_DNNQ')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec6whP1uYEtfk6zs',
    company_role = 'Head of Channel Sales AU & NZ',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new partnerships with CPA.com and GrowCFO. Great moves for the ANZ market!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in the finance software space at the moment. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market for SDRs in finance software across ANZ? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in fintech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Andrew Wilkins') OR linkedin_url = 'https://www.linkedin.com/in/andrewjwilkins')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec70chjeQIIFwh8t',
    company_role = 'Director - Sales & Customer Success',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new Melbourne office fit-out. Looks amazing!',
    linkedin_follow_up_message = 'We''re working with some excellent BD candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around Business Development hires in the software space. The Melbourne market has been quite dynamic lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Tom Jackson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAArTmzIBDeODYiSoDDTlhbal9wFVOVoIy_8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec7HEx7QFxCGlMIy',
    company_role = 'Head of Commercial',
    employee_location = 'Moonee Ponds, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Melbourne office growth at Onside. Love seeing the local team expansion in AgriTech!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Executive candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team in Melbourne. How are you finding the local talent market for senior sales roles? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in AgriTech. The Melbourne market has been quite active lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jack Mullard') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACPgIgIByrpSDkR7GuyUBh5VfIxt3a4JwoE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec7a7tgYJk0XgsEt',
    company_role = 'A/NZ Subscription & Annuity (Renewals) Manager',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about IBM''s $6 billion GenAI business growth. That''s impressive momentum.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong sales specialists in the automation platform space. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Brand Sales Specialist for the automation platform. How''s the search going? We work with companies like HubSpot on similar sales roles across ANZ.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Cheryl Duggan') OR linkedin_url = 'https://www.linkedin.com/in/cheryl-duggan-bb15145')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec7eOwX23WQUdquS',
    company_role = 'State Sales Manager NSW, WA & QLD - National Automotive Lead',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'in queue',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the AdFixus partnership news. Great move for the digital advertising capabilities.',
    linkedin_follow_up_message = 'We''re working with some strong Sales Managers in marketplace businesses at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the marketplace talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Manager hires in classifieds and marketplace businesses.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Christie Taylor') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAdcstcBJEGkDyseKpNbUzRfKZkITBvEzw8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec7mfO6oOEQhgoVJ',
    company_role = 'Channel Partner Manager',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Microsoft Teams Unify certification news. Being the first independent vendor is huge. Congrats!',
    linkedin_follow_up_message = 'We''re working with some excellent CSM candidates with partner channel experience. Companies like HubSpot and Docusign have found our approach helpful when scaling their customer success teams.',
    linkedin_connected_message = 'I see you''re building out your customer success team. How are you finding the CSM talent market? We''re noticing some interesting shifts, particularly around customer success hires in contact centre tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jude Don') OR linkedin_url = 'https://www.linkedin.com/in/judedon')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec7ukafotWKuEHjN',
    company_role = 'Director - Product Strategy & Enablement',
    employee_location = 'St Leonards, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Agent Pay launch. Love seeing Mastercard''s innovation in AI payments.',
    linkedin_follow_up_message = 'We''re working with some excellent consulting sales leaders who understand product strategy. Companies like HubSpot and Docusign have found our approach helpful when scaling their product-led sales functions.',
    linkedin_connected_message = 'I see you''re expanding the consulting sales team. How are you finding the market for product-focused sales talent? We''re noticing some interesting shifts in the talent landscape, particularly around Director level hires who can bridge product strategy and sales in fintech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Mohammed Fouladi') OR linkedin_url = 'https://www.linkedin.com/in/mfouladi')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec7vijxIzx48dS2S',
    company_role = 'VP and Country Manager ANZ',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $500M Series C news. Congrats on the funding!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in IT management and cybersecurity.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Geoff Davies') OR linkedin_url = 'https://www.linkedin.com/in/geoffdavies1')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec89IHoaNat7uQLL',
    company_role = 'Head of Enterprise Sales and Account Management, ASEAN and North Asia',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on closing the AIB Merchant Services acquisition! That''s fantastic news for the European expansion.',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Director candidates across fintech if you''re looking externally.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in fintech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Daniel Wong') OR linkedin_url = 'https://www.linkedin.com/in/daniel-wong-20775721')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec8Dw396b3CqLbKk',
    company_role = 'Senior Manager, Account Management - Asia, Africa, and Australasia',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing Cvent''s growth in Melbourne''s events scene!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.',
    linkedin_connected_message = 'I see you''re building out your account management team. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around Account Manager hires in the events tech space. The Melbourne market has been quite active lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Izzy Hettiarachchi') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAANZUSQBYc-KPrH339AbJ2TCO0JbYnwOKKo')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec8EIClgmmkcKDTM',
    company_role = 'Principal Sales Operations Manager',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney hiring surge at Intercom. 17 roles in 60 days is impressive!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases like yours.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in Sydney. The competition for quality AE talent has definitely heated up with all the expansion happening across SaaS companies in the area.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Leo Zhang') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAT6qq8BbjTrWvzDIbrK3ZVjGjaRvtL_Cfk')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec8FKT64UecPW2t4',
    company_role = 'Regional Director',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Victorian public sector wins. Great local impact!',
    linkedin_follow_up_message = 'We''re working with some excellent business development candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.',
    linkedin_connected_message = 'Hope you''re well Michael! I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the market, particularly around business development hires in Melbourne. With all the Victorian public sector momentum you''ve got going, I imagine you''re looking at some exciting growth opportunities. Would love to chat about what we''re seeing in the market.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Michael Hull') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAB9bQ4BG34nJ2m_iV8ndahqhZobl3N0fd8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec8QSRxfJteUQ4Bz',
    company_role = 'General Manager',
    employee_location = 'Perth, Western Australia, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Weir acquisition news. That''s huge for Perth!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during major transitions and scaling phases.',
    linkedin_connected_message = 'Hope you''re well Adam! I see you''re building out your sales team. How are you finding the Perth talent market with all the changes happening? We''re noticing some interesting shifts in the market, particularly around enterprise sales hires in mining tech. Would love to share what we''re seeing if helpful.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Adam Brew') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAhAqd0Bjs5Lwxsp7wy9DT87z-7eXIZ8vqo')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec8Vi5fK6o1xrjqJ',
    company_role = 'Senior Director - Field & Member Services',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the APAC hub approach from Sydney. Smart regional strategy!',
    linkedin_follow_up_message = 'We''re working with some excellent senior account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out their regional teams.',
    linkedin_connected_message = 'I see you''re building out your account management team. How are you finding the talent market across the region? We''re noticing some interesting shifts around senior account manager hires in the IT services space, particularly with companies scaling their APAC operations.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Sruthi K.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAhct7UBcE7tc2KOCHERSIAjhOJeNf-Br4E')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec8XrWa34AfLsT3f',
    company_role = 'Head of Sales - APAC',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'lead_lost',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Q2 earnings results. Love seeing Sprout Social beating analyst expectations!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out enterprise sales in Australia. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise AE hires in SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Pavel Kamychnikov') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAdebqMBamtw7bVKv4XhaFK1825UvkrcWg0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec8nM8D0Nyse0nWq',
    company_role = 'Senior Sales Director - APAC & IMEA, Suppliers & venue solutions',
    employee_location = 'Singapore, Singapore',
    stage = 'connected',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw Cvent at AIME Melbourne. Love the local presence!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Manager hires in the events tech space. With all the optimism around in-person meetings growth heading into 2025, there seems to be real momentum in Melbourne right now.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Naina Vishnoi') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAVivAoBbrNnODb27V6QMaM4i55BiYGy7jY')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec9fL9vJCtOI3Lu4',
    company_role = 'National Sales Manager',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Cisco Partner Summit award news. Congrats on the Crisis Response Award!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in tech and IoT space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('James Hanna') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAdJxgBfLuWUw2RDn2WmSgyS-DoB9F5kw0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec9mIBN2s6QiKiZZ',
    company_role = 'Sales Manager',
    employee_location = 'Brunswick, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the MiClub golf club success story. Great local impact!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AEs at the moment who have strong cloud security backgrounds. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.',
    linkedin_connected_message = 'I see you''re building out your enterprise sales team. How are you finding the talent market for senior AEs in the cloud security space? We''re noticing some interesting shifts in the market, particularly around enterprise sales hires who can navigate complex cybersecurity solutions.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Margaret Selianakis') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAnwFMBLTKYN4izcEKNVTJlklxIWqRaZz8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec9q2wlHikQ8gG0L',
    company_role = 'Regional Vice President (RVP) A/NZ',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love what Cornerstone''s doing in the HR tech space!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around BDR hires in SaaS. The demand for quality candidates who can navigate complex enterprise sales cycles has really picked up. Would love to chat about what we''re seeing if you''re open to it.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('David Wright') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAASgczwB3c_Jy9Yy1mSBWoRzqSRtnNehDGI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec9tENYimdhE2txc',
    company_role = 'Director ANZ Sales Operations, Global Sales Operations',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new Sydney office opening at Australia Square. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases like yours.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market since the office launch? We''re noticing some interesting shifts in the talent landscape, particularly around Account Manager hires in Sydney with all the expansion happening.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Isobel Shurley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAkW-q4BRyYG2FKlqmS04ASROo4reH6Jd6A')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rec9y8lp1H1fDmSms',
    company_role = 'Sr Regional Sales Director',
    employee_location = 'Melbourne, Australia',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Gartner Leader recognition for HCLSoftware. Congrats on that achievement!',
    linkedin_follow_up_message = 'We''re working with some strong Sales Director candidates in enterprise software. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Sales Director at HCLSoftware. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Kiran Ajbani') OR linkedin_url = 'https://www.linkedin.com/in/kiranajbani')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recA5zyxdE11Asofv',
    company_role = 'Sales Leader - Asia Pacific and Japan (Application Security)',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Gartner Leader recognition for HCL Software. Great achievement for the team!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Sales Director candidates in enterprise software. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Sales Director at HCL Software. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Randeep Chhabra') OR linkedin_url = 'https://www.linkedin.com/in/randeep-chhabra-3581b26')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recALzvi9TUNcDtAA',
    company_role = 'Director of Business Development& Partnerships, EMEA & APAC',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Ascend Australia summit in Melbourne. Great local engagement!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in the fraud prevention space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the landscape, particularly around AE hires in fraud prevention. The local fintech scene seems to be heating up with all the ecommerce growth.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Avi Ben-Galil') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA8ffksBtqrpyvh-1x5tG3A2kryAdKNfhxc')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recAVEfKluCdO3422',
    company_role = 'Area Vice President, ANZ',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new Sydney data centre launch. Exciting expansion!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases like yours.',
    linkedin_connected_message = 'I see you''re building out your enterprise sales team. How are you finding the local talent market with all the expansion happening? We''re noticing some interesting shifts in the talent landscape, particularly around senior AE hires in Sydney.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jaye Vernon') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABlQoaMBrAFqQD7MksNFiJ-i4u4clOxYse0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recAWrugQA8E0WNB5',
    company_role = 'Senior Manager, Enterprise Sales ',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the inaugural Protect Tour in Sydney. Great turnout!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your BDR team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around BDR hires in cybersecurity here in Sydney.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Adrian Valois') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABAXBnUBaOY1Vl_Lm1GYO2HAEE2RuRfT_P8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recArXdx1MRnheDud',
    company_role = 'Chief Sales Officer',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the intelliHR rebrand to Humanforce HR. Smart consolidation move!',
    linkedin_follow_up_message = 'We''re working with some excellent Solutions Consultants and presales professionals at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their customer facing teams.',
    linkedin_connected_message = 'I see you''re in the Solutions Consultant space at Humanforce. How are you finding the market with all the cloud migration activity happening? We''re noticing some interesting shifts in the talent market, particularly around presales and solutions roles in the HCM space. The North Sydney hub seems to be really growing from what we''re seeing.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Aaron Thorne') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABGzwZUBA5LAplhseW7ZywUqYZgNT7uwujA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recB1ZLio9tCZRIer',
    company_role = 'Channel Director Asean',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Melbourne office expansion. Love the local growth!',
    linkedin_follow_up_message = 'We''re working with some excellent mid-market AEs at the moment who understand the privacy compliance space really well. Companies like HubSpot and Docusign have found our approach helpful during their local expansion phases.',
    linkedin_connected_message = 'Hope you''re settling in well with the Melbourne expansion! How are you finding the local talent market? We''re seeing some interesting shifts around mid-market AE hiring in the privacy space, particularly with all the regulatory changes happening locally.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Eric Seah') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEw5YMBlGqi0hOaj20kgnfkKxxTlM52zak')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recBe4y2QYxu0jkqU',
    company_role = 'Sales Manager',
    employee_location = 'Gaythorne, Australia',
    stage = 'connection_requested',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sirius Solutions acquisition news. Great move to expand your transformation capabilities!',
    linkedin_follow_up_message = 'We''re working with some strong CSM candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a CSM at eTeam. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Georgia Hinks') OR linkedin_url = 'https://www.linkedin.com/in/georgia-hinks-7443b034a')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recBkUkl1dvVaO0AL',
    company_role = 'Sales Manager, Business Development',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Better by SafetyCulture event in Sydney. That looked fantastic!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AE candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.',
    linkedin_connected_message = 'I see you''re building out your enterprise team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent landscape, particularly around senior AE hires in the SaaS space. With SafetyCulture being voted one of Australia''s top workplaces, you must be attracting some great candidates.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Rosie Courtier') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAB6P9ikBoPVoGdTWSGB5xcwF8ekUnHiMus4')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recBpKzlIqEuc39EH',
    company_role = 'Senior Sales Operations Manager',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Deputy Payroll launch. That''s a huge win for shift-based businesses!',
    linkedin_follow_up_message = 'We''re seeing some strong Account Manager talent in the market lately. Companies like HubSpot and Docusign have found our approach helpful during product expansion phases.',
    linkedin_connected_message = 'I see Deputy just launched the new payroll solution. How are you finding the local market response? We''re noticing some interesting shifts in the talent landscape, particularly around Account Manager hires in workforce management.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Angus MacRae') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABjmy_0B8deeVR5o8IayMxX1GsSLutw0QM4')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recBqR8dj4h6Aaff9',
    company_role = 'Managing Director AU / NZ- Regional Director APAC',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about the multi-million dollar contract win in Australia. Congrats on landing that!',
    linkedin_follow_up_message = 'We''re working with some experienced Regional Sales Directors in automotive finance at the moment. Companies like HubSpot and Docusign have found our approach helpful for senior sales hires.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the market for senior sales talent in automotive finance? We''re noticing some interesting shifts in the talent landscape, particularly around Regional Sales Director hires in fintech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Farooq Fasih Ghauri') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAXn808BJihsG8YgOUwvVWxpPBY3RS5yP8U')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recC3jcIBsyEwOW2s',
    company_role = 'Sales Director, Commercial',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new Sydney data centre launch. Exciting times at Braze!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their local expansion phases.',
    linkedin_connected_message = 'I see you''re part of the big Sydney expansion. How are you finding the local talent market with all the growth happening? We''re noticing some interesting shifts in the market, particularly around enterprise AE hires as companies scale their ANZ operations.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Dan Hartman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABAkdiABz4AQpCa8WN-GpRLmkiBPdFnyDYI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recC61FhHRn6WCuHt',
    company_role = 'Director Corporate Sales APAC',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Australian data residency launch. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling into new market opportunities.',
    linkedin_connected_message = 'I see you''re building out your enterprise team. How are you finding the market with all the new opportunities from the data residency launch? We''re noticing some interesting shifts in the talent market, particularly around enterprise sales hires in the regulated sectors.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Kim Gardiner') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAv-VjcBeFpwkNt8Joe8QCb2W-DiWV0yCgA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recCBb75CHviEe1J8',
    company_role = 'Vice President, Sales & Customer Success',
    employee_location = 'Greater Melbourne Area',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new Melbourne office fit out. Love the local investment!',
    linkedin_follow_up_message = 'We''re working with some excellent BD candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams locally.',
    linkedin_connected_message = 'I see you''re building out your BD team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around business development hires in the govtech space. The Victorian public sector expansion you''re seeing must be creating some exciting opportunities.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Reece Watson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAfRa-8BKkZ1A6rDggqIIjQfuTFV_Uq8s6s')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recCD7F1y38E15hXB',
    company_role = 'VP Sales, Asia Pacific',
    employee_location = 'Australia',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Gartner Magic Quadrant recognition. Congrats on the Visionary status!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in the communications space at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the communications tech market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in API and communications platforms.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Gareth Parker') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFNYkwBhoK2hXsy39aXjdmy-7_w2IApl1k')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recCIA74gbbx8wL12',
    company_role = 'VP of Sales APAC',
    employee_location = 'Singapore, Singapore',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $60M funding and SF move. Congrats on the milestone!',
    linkedin_follow_up_message = 'We''re working with some strong Enterprise AE candidates in the ANZ market. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring Enterprise AEs in ANZ at Zilliz. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Yue Wang') OR linkedin_url = 'https://www.linkedin.com/in/yue-wang-721317280')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recCWv1EAS9cBvdq4',
    company_role = 'Enterprise Sales Manager',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love what you''re building across Sydney''s CBD!',
    linkedin_follow_up_message = 'We''re working with some excellent sales candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in competitive markets.',
    linkedin_connected_message = 'I see you''re hiring for a Sales Executive role. How are you finding the local talent market? We''re noticing some interesting shifts around sales hiring in Sydney, particularly with the coworking space growth. Always keen to chat with sales leaders about what they''re seeing on the ground.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Polly Parker') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAdR2UYBf976d6piwzdm_lU8vcJpGsiKuO0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recCeTunTD5V3zj0l',
    company_role = 'Manager, Commercial Sales ANZ',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Bits AI updates at DASH 2025. Love seeing the autonomous code fixes feature.',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Engineers with AI and observability backgrounds. Companies like HubSpot and Docusign have found our approach helpful for technical roles.',
    linkedin_connected_message = 'I see you''re building out your Sales Engineering team. How are you finding the market for technical talent in ANZ? We''re noticing some interesting shifts, particularly around Sales Engineering hires in observability platforms.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Oliver Godwin') OR linkedin_url = 'https://www.linkedin.com/in/oliver-godwin-603833178')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recCgo0RcsrPYcplH',
    company_role = 'Head of Business, Singapore',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the Australia expansion strategy. Great timing!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful when expanding into new markets.',
    linkedin_connected_message = 'I see you''re building out the team for the Australia launch. How are you finding the talent market here? We''re noticing some interesting shifts in the fintech space, particularly around BDR hires who understand the payments landscape. The merchant acquiring space is getting competitive, but there''s some strong talent around.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Keith Chen') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAeJN90BfvO6ltDf-p_IYsCKyk-KOuB25qU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recChRe2stvwzpEhw',
    company_role = 'Territory Sales Manager - ANZ',
    employee_location = 'Greater Brisbane Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Simpro Marketplace launch from Brisbane. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise Account Manager candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise Account Manager hires in field service software. The growth you''re seeing with the Marketplace launch must be creating some great opportunities.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Justin Barlow') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATvy-AB0svvj7XMtSSMWyfogHSNf-xBbek')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recCviIMZke1LDLEL',
    company_role = 'Assistant Director, Public Relations (Asia Pacific)',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = 'Low',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about hitting $100M ARR. Congrats on the milestone!',
    linkedin_follow_up_message = 'We''re working with some strong AE candidates with IP and tech backgrounds at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the market for AE talent? We''re noticing some interesting shifts in the IP and tech space, particularly around experienced AE hires who understand complex B2B sales cycles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Serene Foo') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAB5RaFoBV8KjFjdzBBYcS36HQhtfaQVkAus')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recD8qWuOHscqZdjA',
    company_role = 'VP of Sales',
    employee_location = 'North Narrabeen, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Deputy Payroll launch in Australia. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent market, particularly around Account Manager hires in workforce management. The payroll launch must be driving some serious growth opportunities for you guys.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Steven Clement') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEb4DUBeUwi6SQDUVdEgo6OeU2nxm9Z0n8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recDKzLrskXw13hwA',
    company_role = 'Growth Marketing Lead',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'Low',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney expansion news. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent CSM candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.',
    linkedin_connected_message = 'I see you''re building out your team in Sydney. How are you finding the CSM market there? We''re noticing some interesting shifts in the talent landscape, particularly around Customer Success hires with the number of companies expanding into Australia.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Lorena Casillas') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAArZtHcBuwryEeDIF-jhYJxtymiKqkKFhgg')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recDOVaQh3eqKb42L',
    company_role = 'Sales Director',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney partner bootcamps in May. Great initiative!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in the Sydney market at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team at Saviynt. How are you finding the local talent market? We''re noticing some interesting shifts in the talent space, particularly around Account Executive hires in Sydney. With all the expansion happening at Three International Towers, I imagine you''re seeing increased demand for quality sales talent.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Suhail Ismail') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA8POsUBAIK11SjhnMOOuawfoGcHyfmyezU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recDQoJ16cq1xDNe3',
    company_role = 'Commercial Manager',
    employee_location = 'Brisbane, Queensland, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the rebrand to Klipboard. Exciting evolution from KCS!',
    linkedin_follow_up_message = 'We''re working with some excellent New Business Sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around New Business Sales Executive hires in the SaaS space. The field service management sector has been heating up lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Steven Newman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAANOCu4BS8cuqi05PQq5R9ZYNqoeR_tzY6w')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recDRuSgo75dHVAy5',
    company_role = 'Sales Director @ShiftCare',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new platform updates for aged care compliance. Great timing with the 2025 reforms coming.',
    linkedin_follow_up_message = 'We''re working with some strong BDR candidates in healthcare tech at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the healthcare tech market? We''re noticing some interesting shifts in the talent landscape, particularly around BDR hires in aged care and health services.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Mark Henderson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAWqQYAB5z24_8cQjHckIE9DDjkt5ldZan8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recDjf3njedZothfQ',
    company_role = 'Sales Leader - Asia Pacific & Japan',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the X4 Sydney Summit news and the new AI tech launch. That''s exciting stuff!',
    linkedin_follow_up_message = 'We''re working with some great Partner Sales Managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their channel teams.',
    linkedin_connected_message = 'I see you''re building out the partner team. How are you finding the channel sales market in Australia? We''re noticing some interesting shifts in the talent landscape, particularly around Partner Sales Manager hires in SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Andrew Maresca') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAGm_ngBlrNLRD8VjSJg2E0g4YGtaqjmggM')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recDnNqETYEy30FdY',
    company_role = 'Managing Director ANZ',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the mROC Alliance Partners launch. Great move expanding the channel program!',
    linkedin_follow_up_message = 'We''re working with some experienced Channel Account Managers in cybersecurity. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the cybersecurity talent market? We''re noticing some interesting shifts in the landscape, particularly around Channel Account Manager hires in enterprise security.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Sam Salehi') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADw8q0BPsC8bsHeAWjHfZdpavb__4oqcrc')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recDwNVna2H5DYHZo',
    company_role = 'Director of Sales, Enterprise & Strategic',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Better by SafetyCulture event in Sydney. Great showcase!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AE candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.',
    linkedin_connected_message = 'Hope you''re well Luke! I see you''re building out your enterprise team. How are you finding the Sydney talent market? We''re noticing some interesting shifts around senior AE hires locally, especially with the competition for enterprise experience heating up.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Luke Corkin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAASHenMBnjTJ7sZ5hQFwcICyOduXaznsUJA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recEAeRQdwSI5MjfU',
    company_role = 'General Manager - WA',
    employee_location = 'Perth, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Cisco Partner Summit award news. Congrats on the Crisis Response Award!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates with tech backgrounds at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the AE market in Melbourne? We''re noticing some interesting shifts in the talent landscape, particularly around tech sales hires with IoT experience.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Michael van Zoggel') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAQnMoEBHcV6X9lOylMcccIYqzK79CQ1vIs')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recED41KqdkZSijCZ',
    company_role = 'Regional Vice President of Sales - APJ',
    employee_location = 'Canberra, Australian Capital Territory, Australia',
    stage = 'replied',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the Regional Executive APJ role. Exciting times!',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during regional expansion phases.',
    linkedin_connected_message = 'I see you''re building out the team across APAC. How are you finding the talent market as you scale regionally? We''re noticing some interesting shifts in the market, particularly around Enterprise AE hires in cybersecurity.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Tom Tokic') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABznFYBZk-gXM3qpGrIN-NKxhDHFngk5co')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recEMzFWrI1jx4zoB',
    company_role = 'General Manager, Australia & New Zealand',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the OpenPay acquisition news. Smart move expanding into billing!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases.',
    linkedin_connected_message = 'I see you''re building out your SDR team. How are you finding the fintech talent market with all the expansion happening? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in high-growth fintech companies.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Arnold Chan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAARePtUBmXogWwJ6w5A7SG378L6NTyuXunE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recETIRbIREFhHMm5',
    company_role = 'Embedded IoT Sales and Key Account Executive',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the partnership news with Nagarro. That''s exciting for the WISE-Edge platform!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Key Account Manager candidates in the IoT space. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Key Account Manager at Advantech. How''s the search going? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Steve Bailey') OR linkedin_url = 'https://www.linkedin.com/in/stevenmichaelbailey')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recEd6tILCyiLh43z',
    company_role = 'Sales Manager',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the school partnerships work with ZAAP. Smart move in NSW!',
    linkedin_follow_up_message = 'We''re working with some excellent partnerships candidates at the moment who have that rare combo of enterprise sales experience and payments industry knowledge. Companies like HubSpot and Docusign have found our approach helpful when building out their partnerships teams.',
    linkedin_connected_message = 'I see you''re building out your partnerships team. How are you finding the talent market for enterprise sales roles in payments? We''re noticing some interesting shifts in the landscape, particularly around partnerships hires in fintech where candidates are looking for that blend of relationship building and technical product knowledge.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Kane McMonigle') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAgrtBMBUprFiMISkY6p8LzUnQIOvbJXeL4')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recEfBn7fJ5Cgczle',
    company_role = 'Vice President  of Sales - Asia Pacific & Japan',
    employee_location = 'Singapore, Singapore',
    stage = 'in queue',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Australian cloud launch. That''s exciting for the local market!',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams in competitive markets.',
    linkedin_connected_message = 'I see you''re building out your team in Sydney. How are you finding the local talent market? We''re noticing some interesting shifts around Enterprise AE hires, especially with companies expanding their local presence like Talkdesk. The regulated industries focus seems to be driving some unique hiring patterns.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Peter Coulson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAuwb78B8XQx_C0DX5QZmF4eqynyaDms8oU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recEfMzFcIyfKzu32',
    company_role = 'Regional Sales Director',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Onfido acquisition news. Great move for digital security!',
    linkedin_follow_up_message = 'We''re seeing some strong government sales talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.',
    linkedin_connected_message = 'Hope you''re settling into the Senior Sales Executive role well! How are you finding the government sector''s response to enhanced identity verification solutions? We''re seeing some interesting shifts in the talent market, particularly around enterprise sales hires in cybersecurity, especially with all the focus on AI-driven security threats lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Max Ebdy') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABdB_7cBM62q2SH3Vho3ZDP9K6meoahdCVc')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recEfXyn4cpUyvhOR',
    company_role = 'Sales Manager',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw Huntress hit the 10 year milestone. Congrats on the anniversary!',
    linkedin_follow_up_message = 'We''re working with some strong AE candidates in cybersecurity at the moment. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the cybersecurity talent market? We''re noticing some interesting shifts, particularly around AE hires with all the growth happening in security.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jimmy Wang') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACR6moABzsa_EZsbxlgZadJgk8PyfyhwK5Y')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recEyTd7dEORQMnVz',
    company_role = 'GM and Head of GTM APAC',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw Sprout Social smashed earnings expectations. Love seeing that growth momentum!',
    linkedin_follow_up_message = 'We''re working with some strong enterprise sales leaders at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling in APAC.',
    linkedin_connected_message = 'I see you''re building out enterprise sales in Australia. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Senior Sales Manager hires in SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Will Griffith') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAApjv8BZppnh4puYzrxFdpefiFqGKLoZ8k')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recEzGaiHYLuuv6AP',
    company_role = 'VP Sales and Revenue',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Rugby Football League results. 85% completion rate across 5,000+ learners is impressive!',
    linkedin_follow_up_message = 'We''re working with some excellent CSM candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your customer success team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around CSM hires in edtech and learning platforms.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Cam O''Riordan') OR linkedin_url = 'https://www.linkedin.com/in/camoriordan')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recF1XZSgkqaHKVFk',
    company_role = 'Senior Sales Executive - Associate Director - Microsoft Government & Enterprise Accounts ANZ',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing KPMG''s digital transformation completion. Moving to cloud is a big win.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some experienced Salesforce leaders at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see KPMG is hiring a Salesforce Director. How are you finding the search? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Clayton Bennell ☁️') OR linkedin_url = 'https://www.linkedin.com/in/clayton-bennell-☁️-627aa258')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recF2IC4BHBgPJmxG',
    company_role = 'General Manager, Asia Pacific at Sage',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the AI-first strategy announcement at Sage Future 2025. Love the direction you''re heading!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in the finance software space at the moment. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market for SDRs in finance software across APAC? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in fintech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Damon Scarr') OR linkedin_url = 'https://www.linkedin.com/in/damonscarr')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recF2IE7TURv5zWKE',
    company_role = 'National iRetail Key Account Manager',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the iF Design Award win for the WISE-IoT solution. Great recognition!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some experienced Key Account Managers at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Key Account Manager at Advantech. How''s it going? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Daniel Skaler') OR linkedin_url = 'https://www.linkedin.com/in/daniel-skaler-8ba8519')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recF9izJdT0hkL97c',
    company_role = 'Director, Regional Sales, AU/NZ',
    employee_location = 'Greater Adelaide Area, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the SpaceX satellite launch news. Love seeing the constellation expansion!',
    linkedin_follow_up_message = 'We''re working with some great SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the market for SDR talent? We''re noticing some interesting shifts in the IoT space, particularly around early stage sales hires.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Dan Franklin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA0FUvABwDeQ2fjqPTgKNWXlwefMopbUXro')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recFPoGRmiBcNmSui',
    company_role = 'Regional Sales Leader -Japan, Korea & Queensland',
    employee_location = 'Brisbane, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Cisco Live announcements about the AI Assistant integration. Exciting developments for ThousandEyes!',
    linkedin_follow_up_message = 'We''re working with some strong regional sales managers in the observability and network monitoring space. Companies like HubSpot and Docusign have found our approach helpful when scaling across APAC markets.',
    linkedin_connected_message = 'I see you''re building out your regional sales team across ANZ, ASEAN and China. How are you finding the market? With all the new AI capabilities and platform expansions, we''re seeing increased demand for experienced sales talent in the observability space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Onur Dincer') OR linkedin_url = 'https://www.linkedin.com/in/onur-dincer-a115881')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recFTJ0dNMTahCXz8',
    company_role = 'Enterprise Sales',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Microsoft Teams Unify certification news. Being the first independent vendor is huge. Congrats!',
    linkedin_follow_up_message = 'We''re working with some excellent CSM candidates with enterprise experience at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their customer success teams.',
    linkedin_connected_message = 'I see you''re building out your customer success team. How are you finding the CSM talent market in Melbourne? We''re noticing some interesting shifts in the customer success space, particularly around enterprise CSM hires in contact centre tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Matt Carter') OR linkedin_url = 'https://www.linkedin.com/in/mrc102')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recFVJJnnlMYUpNGu',
    company_role = 'Senior Sales Director - APAC, at Info-Tech Research Group',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the growth Info-Tech is seeing. The Leadership Summit programs look great!',
    linkedin_follow_up_message = 'We''re working with some excellent senior account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.',
    linkedin_connected_message = 'I see you''re building out your account management team. How are you finding the talent market for senior AMs in Sydney? We''re noticing some interesting shifts in the landscape, particularly around enterprise account management hires in the IT services space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Chloe Frost') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATOy8oBGBIxKGKvs2pKBnzsUUPqxI1fb04')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recFVqOV6GbpEGK3L',
    company_role = 'Senior Sales Director',
    employee_location = 'Melbourne, Australia',
    stage = 'replied',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the breakthrough H1 results. 30% ARR growth is impressive!',
    linkedin_follow_up_message = 'We''re working with some strong presales candidates in the AI space.',
    linkedin_connected_message = 'I see you''re hiring a Presales Consultant for AI Growth at IFS. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Tercio Couceiro') OR linkedin_url = 'https://www.linkedin.com/in/tcouceiro')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recFYbTUhsrbBmp6K',
    company_role = 'Head of Sales, APAC',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the ADS Solutions partnership news. Great move expanding into wholesale distribution.',
    linkedin_follow_up_message = 'We''re working with some strong technical presales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful for specialized sales roles.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the technical presales market? We''re noticing some interesting shifts in the talent landscape, particularly around technical sales hires in data analytics.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jade Marishel GAICD') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAgYWagBvtREM89QnXm5qpQARI8g2G13r50')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recFfzpLJUN32iooi',
    company_role = 'Head of Sales and Go to Market Australia and New Zealand',
    employee_location = 'Greater Melbourne Area',
    stage = 'in queue',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the ANZ expansion strategy. Great move into the region!',
    linkedin_follow_up_message = 'We''re working with some excellent Client Account Executive candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise sales teams.',
    linkedin_connected_message = 'I see you''re building out your Client Account Executive team. How are you finding the talent market with all the expansion happening? We''re noticing some interesting shifts in the market, particularly around enterprise sales hires in the data transformation space. The demand for experienced AEs who understand complex B2B sales cycles has really picked up.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Scott Smedley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAA9EIEBGPlCaGHKHov3-n3mR4O_vgOu6Pg')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recFm9AwEgS2K4Eks',
    company_role = 'National Sales Manager',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw Ordermentum hit $2 billion in transactions. That''s huge! Congrats on the milestone.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Sales Enablement candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Sales Enablement Manager at Ordermentum. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('James Meischke') OR linkedin_url = 'https://www.linkedin.com/in/jamesmeischke')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recFqSeEcsM0Ke8MT',
    company_role = 'Senior Product Manager, Issuing',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Indue acquisition news. Big move for the payments space!',
    linkedin_follow_up_message = 'We''re working with some excellent BD candidates in the payments space at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the landscape, particularly around Business Development hires in payments. With all the growth happening at Cuscal, I imagine finding the right people is pretty crucial right now.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Sarah Rowley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAV9TdcBAIRl3VJyUwn3KS2pGWj5QqajpHE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recFxsZZQpQlugE64',
    company_role = 'Area Manager - North QLD',
    employee_location = 'North Mackay, Queensland, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Toustone acquisition news. Great move expanding into data analytics!',
    linkedin_follow_up_message = 'We''re working with some experienced Sales Executives in the resources space at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market for senior sales talent in the resources sector? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Executive hires in mining and ERP.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Tony Spencer') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADsZLcBJKcinOvAXKxXZXnX6uBDWxqTLbw')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recG9dGhxLLYtIpFe',
    company_role = 'Regional Director, Pacific',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the RSA Conference awards news. Congrats on the three wins!',
    linkedin_follow_up_message = 'We''re working with some strong SDR candidates in the cybersecurity space. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring SDRs across Australia and Singapore. How are you finding the market? We work with companies like HubSpot on similar partner roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Matthew Lowe') OR linkedin_url = 'https://www.linkedin.com/in/matthew-lowe-1722357')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recGA0gV1wIachk0t',
    company_role = 'Vice President - Sales ANZ',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'in queue',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Simpro Marketplace launch from Brisbane. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise Account Manager candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in competitive markets.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market for enterprise sales talent? We''re noticing some interesting shifts in the talent landscape, particularly around Account Manager hires in field service software. The growth at Simpro with the marketplace launch and Simprosium coming up must be creating some great opportunities.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Carly Roper') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEUaeMBmM10JokHFgt5BftA6MD-ojBQR_I')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recGGTsczhOxZfQiX',
    company_role = 'Head of Sales - ERP',
    employee_location = 'Sydney, Australia',
    stage = 'connected',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sage Intacct 2025 Release 2 news. Love the AI automation features!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in the ERP space at the moment. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market for SDRs in ERP and finance software? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in enterprise software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Gareth Moore') OR linkedin_url = 'https://www.linkedin.com/in/gareth-moore-479b453')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recGHwJVwIQDYKiXu',
    company_role = 'Managing Director',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about the new PoC Centre at Western Sydney Uni. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some great Sales Engineers in automation at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the technical sales market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Engineer hires in automation and robotics.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Henry Zhou') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKQkroBpUiARR_xTuGn672dW1aRVUEWDIY')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recGckz5fgUb6GS8A',
    company_role = 'Sales Manager',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the Sport:80 partnership announcement. Great move into sports organizations.',
    linkedin_follow_up_message = 'We''re working with some excellent CSM candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the edtech market? We''re noticing some interesting shifts in the talent landscape, particularly around CSM hires in learning platforms.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jarod Hart') OR linkedin_url = 'https://www.linkedin.com/in/jarod-hart')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recGctl9jI3NHa1bc',
    company_role = 'HR Business Partner, ASEAN & Greater China',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on closing the AIB Merchant Services acquisition! That''s fantastic news for the European expansion.',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Director candidates across fintech.',
    linkedin_connected_message = 'I see you''re building out your team for Fiserv. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in fintech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Cherie Chay') OR linkedin_url = 'https://www.linkedin.com/in/cheriechay')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recGh32zdTsK3iNW3',
    company_role = 'Director',
    employee_location = 'Greater Melbourne Area',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the 2025 compliance focus. Smart positioning for the market!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in the compliance tech space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Melbourne teams.',
    linkedin_connected_message = 'I see you''re building out your AE team. How are you finding the Melbourne talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in the compliance and GRC space. With Sentrient''s growth to 600+ clients, I imagine you''re seeing strong demand for experienced SaaS AEs who understand the regulatory environment.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('David Barrow') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABAkj64B4ddLP85lR_pcQnJdH2I1ipbMmY8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recGq60bpkBg7QcGi',
    company_role = 'Strategic Growth Lead',
    employee_location = 'Malvern, Australia',
    stage = 'lead_lost',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the UNICEPTA integration and becoming the third largest comms tech suite globally! That''s fantastic news.',
    linkedin_follow_up_message = 'We''re working with some excellent partnerships candidates across enterprise software.',
    linkedin_connected_message = 'I see you''re building out your team for Prophet. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around partnerships hires in enterprise software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Claudia Kidd') OR linkedin_url = 'https://www.linkedin.com/in/claudia-loritsch-0028')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recGqwuyhBGmACZHD',
    company_role = 'Regional Vice President of Sales, Australia and New Zealand',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'in queue',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the SUGCON ANZ 2025 news. Exciting to see Sitecore leading in Sydney!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their new business teams.',
    linkedin_connected_message = 'I see you''re building out your SDR team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around new business development hires in Sydney. The SUGCON event should bring some great networking opportunities too. Would love to chat about what we''re seeing in the market.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Darren Paterson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFnAbABB6kXiXPhSquzADLJ7M1418CsD2A')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recGspGlgPaPi8pZS',
    company_role = 'Senior General Manager - Consumer Sales & Marketing Oceania',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new warranty launch for Melbourne. Great customer focus!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AE candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.',
    linkedin_connected_message = 'I see Canon''s been actively building out the Melbourne team. How are you finding the local talent market? We''re noticing some interesting shifts around enterprise AE hires in the tech space, particularly with companies expanding their direct customer engagement like Canon''s been doing.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Aaron Berthelot') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATzHfkBxxd1rkUUDAwDjv5X9t_Vpi6hn1g')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recGtvdPnf9opfDzs',
    company_role = 'Chief Commercial Officer (CCO)',
    employee_location = 'Greater Sydney Area',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the ZAAP school partnerships launch. Smart move in the NSW market!',
    linkedin_follow_up_message = 'We''re working with some excellent partnerships and enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their partnerships teams in competitive markets.',
    linkedin_connected_message = 'I see you''re building out your partnerships team. How are you finding the market for enterprise sales talent? We''re noticing some interesting shifts in the talent landscape, particularly around partnerships and enterprise sales hires in the payments space. The demand for experienced professionals who understand both the technical and relationship sides has really picked up.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Paul Richardson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA3WGk0BrLm9zH0msivV2hPTCBaIPhvphYA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recGyf7hoIO3QfrMP',
    company_role = 'Regional Director APAC',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $300M ARR news. That''s huge for ClickUp!',
    linkedin_follow_up_message = 'We''re working with some great SMB AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your SMB team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in productivity software with all the growth happening.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Sesh Jayasuriya') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAlVBVoB0gzz0U88FjUwi5UzcRpK87z9a10')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recH2FMa9Axddx20M',
    company_role = 'Region Manager - EOR HR Services - APAC',
    employee_location = 'Bendigo, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Series G news. $450M is huge - congrats!',
    linkedin_follow_up_message = 'We''re working with some strong Sales Development talent in APAC at the moment. ',
    linkedin_connected_message = 'I see you''re hiring a Sales Development Manager at Rippling. How are you finding the APAC market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Shannon King') OR linkedin_url = 'https://www.linkedin.com/in/shannon-king-284247209')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recH8gjwvYpuUr7wP',
    company_role = 'Head of Internal Sales',
    employee_location = 'Sydney, Australia',
    stage = 'in queue',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about Lumi Assistant winning those innovation awards. Congrats on the recognition!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the fintech talent market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in financial services.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Mario Leonidou') OR linkedin_url = 'https://www.linkedin.com/in/mario-leonidou-37189782')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recHfZnwd7umrGemh',
    company_role = 'Sales Manager',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney Work Innovation Summit. That''s exciting stuff!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during their local expansion phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the landscape, particularly around BDR hires in the collaborative work management space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Dallen Yi Zhao Long') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAFc9WaUBmnvt216HmUTQuePCDZ9NbBd3P1E')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recHq1ZqkBSyTEe94',
    company_role = 'Senior Sales Director - APAC',
    employee_location = 'Greater Brisbane Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the established Sydney presence and APAC growth focus!',
    linkedin_follow_up_message = 'We''re working with some excellent senior account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their advisory and client success teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the talent market for senior account management roles? We''re noticing some interesting shifts in the IT consulting space, particularly around candidates who can balance research advisory with client growth in Sydney.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Julian Lock') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEwvkQBLlxtnjb21fPWmyLZs0tTGTTsEEc')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recHs0etnpI9cElmV',
    company_role = 'General Manager - APAC',
    employee_location = 'Adelaide, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the rebrand to Clearer.io. Love the new direction!',
    linkedin_follow_up_message = 'We''re working with some strong Customer Success candidates at the moment.',
    linkedin_connected_message = 'I see you''re hiring a Customer Success Lead at Clearer.io. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Robert G.') OR linkedin_url = 'https://www.linkedin.com/in/robogibson')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recHslXwMye6iGi9o',
    company_role = 'Regional Alliances Manager',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Qlik Connect 2025 launch. Love the new AI capabilities you''re rolling out.',
    linkedin_follow_up_message = 'We''re working with some strong Enterprise AE candidates in the data space at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your Enterprise AE team in Sydney. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in data and analytics.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jose Alba') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABp0P4BizQ4PIl1EYubzv36gMz8P23im3c')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recHz7QcPhQjYtlC3',
    company_role = 'Sales Director',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new 2-year warranty launch for the Arizona printers. Smart move!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AE candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.',
    linkedin_connected_message = 'I see Canon''s been actively hiring in Melbourne lately. How are you finding the local talent market? We''re noticing some interesting shifts around enterprise sales hires, particularly with companies expanding their customer support and warranty offerings like Canon just did.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Dylan Clough') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACtzQOoBZCrnudu08ui52_pDqNVyVbM83ZI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recIYbf9CYlArBDrZ',
    company_role = 'Head of Sales Development',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the $250M ARR milestone in Feb!',
    linkedin_follow_up_message = 'We''re working with some excellent inbound SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during these high growth phases.',
    linkedin_connected_message = 'I see you''re building out your SDR team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around inbound SDR hires in the HR tech space. The growth you''re seeing must be creating some exciting opportunities but also some hiring challenges.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Clare Bagoly') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAgoZ6UB1K_OAxoCglQ0rqMtB7d7cjL4cqE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recIiLd2Kcgx9ihbi',
    company_role = 'NSW Sales Manager at Mediaform Pty Ltd',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing MediaForm''s presence across Sydney, Brisbane and Melbourne!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates in Brisbane at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.',
    linkedin_connected_message = 'I see you''re building out your Account Manager team in Brisbane. How are you finding the talent market for sales roles in the tech supply space? We''re noticing some interesting shifts, particularly around experienced Account Manager hires who understand the B2B technology sector.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Anthony Connors') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABQIYM8B2OOUVKGURSjr4_DjDpVPccj-fcc')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recIovhxLzLlXShW2',
    company_role = 'WA State Sales Manager',
    employee_location = 'Perth, Western Australia, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the ATS acquisition news. Big move for Melbourne operations!',
    linkedin_follow_up_message = 'We''re working with some excellent sales candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.',
    linkedin_connected_message = 'I see you''re building out your team post acquisition. How are you finding the local talent market? We''re noticing some interesting shifts around sales hires in Melbourne, particularly with companies expanding their operations like Tyrolit.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Victor Yong') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACsJ868BrutfqQXc1vOJWfwda-fnTYGVA8g')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recIuYuzACMPttPna',
    company_role = 'Sales Director',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney partner bootcamps in May. Exciting local growth!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team with all the local expansion happening. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the market, particularly around Account Executive hires in identity security.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ash Rahman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABDg628B_Y-v7llDQ3Y0hxHvSxpnaRgZFkc')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recJ5XhyhUN201IDx',
    company_role = 'Group Sales Manager (Non-Endemic), AUNZ - Amazon Ads',
    employee_location = 'Queenscliff, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Anthropic partnership news. That''s a huge move for Amazon!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Account Manager candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring Account Managers at Amazon. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Nicole Daley') OR linkedin_url = 'https://www.linkedin.com/in/nicole-daley-28953496')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recJHUBH1s3fMpLfK',
    company_role = 'Head of Sales',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Zeller for Startups launch. Love seeing you tackle those banking pain points for founders.',
    linkedin_follow_up_message = 'We''re working with some strong mid-market AEs in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the fintech talent market? We''re noticing some interesting shifts in the landscape, particularly around mid-market AE hires targeting the startup space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Louis Whelan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABHrwZMB9yI9VFTGNQzzfG_CFwGKWzxSOt0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recJHUBmRntO3bBl0',
    company_role = 'Human Resources Generalist APAC',
    employee_location = 'Gaythorne, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sirius Solutions acquisition news. Great move to expand your transformation capabilities!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong CSM candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a CSM at eTeam. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Thana Jahairam') OR linkedin_url = 'https://www.linkedin.com/in/thana-jay-1986mar31')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recJOdicG5FDEdbOI',
    company_role = 'Revenue Operations',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'in queue',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Workforce launch in Sydney. 40k agents created is incredible!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AE candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams during rapid growth phases.',
    linkedin_connected_message = 'I see you''re scaling the enterprise team at Relevance AI. How are you finding the Sydney talent market for senior AE hires? We''re noticing some interesting shifts in the enterprise sales landscape, particularly around AI platform companies expanding locally. The growth you''re seeing with 40,000 agents created must be creating some exciting opportunities on the sales side.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Wei Li Lim') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABsPiCwBrG8YQ12Wce-tKg4K7Ov4oAsuKog')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recJQ7lsPrxs3f5y5',
    company_role = 'Area Vice President and Country Manager, Australia and New Zealand',
    employee_location = 'Greater Brisbane Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the State of Data Readiness report for ANZ. Great insights!',
    linkedin_follow_up_message = 'We''re working with some excellent Strategic Account Executive candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise sales teams.',
    linkedin_connected_message = 'I see you''re building out your Strategic Account Executive team. How are you finding the talent market across the region? We''re noticing some interesting shifts around enterprise sales hiring in data security, particularly with the increased focus on cyber resilience that your recent report highlighted.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Craig Bastow') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA3Eb3oBFH0AjvBXND_dkY9sIp6WXduZeR0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recJVvzrbEFhRKw31',
    company_role = 'Regional Sales Manager ASEAN',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the Sydney office expansion. Love the local growth!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in the cybersecurity space at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in cybersecurity. With Darktrace doubling headcount locally, you must be seeing the demand firsthand.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Prem Kumar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACLVMZUBklKivFNcriWs9qSF_q4Yu3eTyDA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recJXgwmNwlnNZK4l',
    company_role = 'National Sales Manager',
    employee_location = 'Greater Brisbane Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the Sydney growth at Silverwater. Exciting expansion!',
    linkedin_follow_up_message = 'We''re working with some excellent strategic account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney operations.',
    linkedin_connected_message = 'I see you''re building out your team with the National Strategic Account Manager role. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around senior sales hires in Sydney''s IT services sector.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Marea Ford') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABAJwk8BTuJfmCiI88ilN9dQ7i3O0_J135o')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recJkk1rNYiEzCxPh',
    company_role = 'Manager, Technical Account Management',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about Mindbody and ClassPass unifying under Playlist. That''s exciting!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong SMB sales candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring SMB Sales Specialists at Mindbody. How are you finding the market? We work with companies like HubSpot on similar outbound roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Sheree Springer') OR linkedin_url = 'https://www.linkedin.com/in/sheree-springer-713312118')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recJrf6jGiRdvWnVi',
    company_role = 'Sales Director (DevOps, AI & Automation)',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the UnO platform launch. AI-powered orchestration looks exciting.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Sales Director candidates in enterprise software. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Sales Director at HCL Software. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Kiran Mudunuru') OR linkedin_url = 'https://www.linkedin.com/in/kiranmudunuru')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recJxv4GcazALbfSm',
    company_role = 'Sales Manager',
    employee_location = 'Elwood, Victoria, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the Sydney office expansion at Australia Square!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during their expansion phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the market, particularly around Account Manager hires in the data security space. With your new office opening, I imagine you''re looking to scale locally. Would love to chat about what we''re seeing in the market.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Will van Schaik') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABLBMIEBBX6aqIpFyxL5kJNXFYlFsJK2NLE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recJyMca1dd1rZ7KR',
    company_role = 'Regional Sales Director - ANZ',
    employee_location = 'Sydney, Australia',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw Securiti made CRN''s 20 Coolest Network Security Companies list. Congrats on the recognition!',
    linkedin_follow_up_message = 'We''re working with some strong channel sales candidates in cybersecurity at the moment. We''ve helped companies like HubSpot and Docusign build out their teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the ANZ market for channel sales talent? We''re noticing some interesting shifts in the cybersecurity space, particularly around Channel Sales Manager hires.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Todd Wellard') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABK3C4BCoyqBabJEkd-lgMlA6BrcN53iOg')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recK2wLxAill7suvH',
    company_role = 'Head of Sales Development ',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Australia Square office expansion. Great Sydney presence!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in the employee engagement space at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in employee engagement. The Sydney market has been quite active lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Janelle Havill') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABLVLPQBojhbU1IAhtwpQGm94qKS2mHrv40')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recK6TDaunmISiOU2',
    company_role = 'Director of Sales, Australia and New Zealand',
    employee_location = 'Barangaroo, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the State of Data Readiness report for ANZ. Great insights!',
    linkedin_follow_up_message = 'We''re working with some excellent Strategic Account Executive candidates in the data security space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise sales teams in competitive markets.',
    linkedin_connected_message = 'I see you''re building out your team in Victoria. How are you finding the talent market for data security roles? We''re noticing some interesting shifts, particularly around Strategic Account Executive hires in the cyber resilience space. The regulatory pressures you mentioned in the report are definitely driving demand for experienced professionals who understand compliance frameworks.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Allan Wang') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAwclRIB7mIFiDcjfsuWmXJqAGe7r6h-7vk')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recK7kOdWqMqZN4wt',
    company_role = 'Alliances Director, ANZ + ASEAN',
    employee_location = 'Randwick, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the CopadoCon India success. That growth in the region must be exciting for you!',
    linkedin_follow_up_message = 'We''re working with some strong BDR candidates in the Salesforce ecosystem. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your BDR team. How are you finding the Salesforce talent market in ANZ? We''re noticing some interesting shifts in the landscape, particularly around BDR hires in the DevOps space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Damien Olbourne') OR linkedin_url = 'https://www.linkedin.com/in/olbourne')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recK8450yDIedgSkm',
    company_role = 'Country Manager - ANZ',
    employee_location = 'Greater Melbourne Area, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the GFL-1500 launch for solar technicians. That''s exciting stuff.',
    linkedin_follow_up_message = 'We''re working with some excellent technical sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their technical teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the technical sales market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Application Manager hires in the testing and measurement space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Kenny Soutar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAQq4EB4S4PwcwJHr_mzLqTtx3XvkjtSuA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recKHyrOzFsZMvr5K',
    company_role = 'Regional Sales Director',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the KuppingerCole leadership recognition!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.',
    linkedin_connected_message = 'I see you''re building out your enterprise sales team. How are you finding the market for senior AE talent? We''re noticing some interesting shifts in the cybersecurity space, particularly around enterprise sales hires who can navigate complex identity solutions.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Fabian Teo') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAt4lU0BTAXs2v_U3qXhuslwguuYR2UBiks')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recKKwV5jBWsJ6LtF',
    company_role = 'Head of Sales ',
    employee_location = 'Brisbane, Queensland, Australia',
    stage = 'connected',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the Great Place to Work certification!',
    linkedin_follow_up_message = 'We''re working with some excellent B2B sales candidates in Brisbane at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in competitive markets.',
    linkedin_connected_message = 'Hope you''re settling in well at aXcelerate! I see you''re building out the sales team there. How are you finding the Brisbane talent market? We''re noticing some interesting shifts around B2B sales hires in the edtech space, particularly with companies scaling their compliance and AI capabilities like aXcelerate is doing.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Lisa Cunningham') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACEsgmoBJFXd1zL7suOs9Td00oCW_z7RLlA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recKXDK3H2n3tujFw',
    company_role = 'Global Supply Chain Director',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Alpina partnership for APAC markets. That''s exciting growth.',
    linkedin_follow_up_message = 'We''re working with some excellent Senior Sales Managers in energy and cleantech at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re expanding the team in Sydney. How are you finding the energy storage talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Senior Sales Manager hires in cleantech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Satory Li') OR linkedin_url = 'https://www.linkedin.com/in/satory-li-541366102')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recKwQCjwa57vIBzg',
    company_role = 'National Sales Manager',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about Christopher Smith joining as APAC MD. Exciting times ahead for Civica!',
    linkedin_follow_up_message = 'We''re working with some great AE candidates with local government experience. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local government market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in gov tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Brett Watkins') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABgHb0UBzXDeyst7xQ6poDGpQP2mJfScVkU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recLI9BRe2jyKSfRD',
    company_role = 'Head of Sales and Strategy',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the NZ expansion news with Endeavour and Thyme. Great move into the Kiwi market!',
    linkedin_follow_up_message = 'We''re working with some experienced Partner Sales Managers at the moment. Companies like HubSpot and Docusign have found our approach helpful for channel roles.',
    linkedin_connected_message = 'I see you''re building out your partner sales team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Partner Sales Manager hires in ERP and tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Matt Crowe') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAA4aNgBgYkull3pYL9O6bhSXxZNTmDLa3g')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recLUnkkq22SdrpD9',
    company_role = 'Sales Director (Master Agent - CBA)',
    employee_location = 'Brisbane City, Queensland, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new warranty launch for Melbourne. Smart move!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Executive candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in Melbourne. With Canon actively recruiting, I imagine you''re seeing the competition firsthand. Would love to chat about what we''re seeing in the market.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Trent Lowe') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAZOFqQBjMdrP0Rd-ZO8LC6gsDjnpFRwa00')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recLVZQHsrmUoUQYt',
    company_role = 'General Manager - Sales',
    employee_location = 'Greater Melbourne Area, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Blue Connections acquisition news. Congrats on the expansion!',
    linkedin_follow_up_message = 'We''re working with some great Sales Executives who have experience in high-growth environments. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the market with all the expansion activity? We''re seeing some interesting shifts in the talent landscape, particularly around Sales Executive hires for companies scaling through acquisitions.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Darren E.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAA9elABVoAqs8vN9lYLcwRS5chWg22MqwU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recLYm4H6HdkSe0WY',
    company_role = 'Senior Vice President, Europe & Asia-Pacific',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw you''re hiring for Senior Account Manager. Exciting times!',
    linkedin_follow_up_message = 'We''re working with some excellent senior account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around senior account management hires in the research and advisory space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Byron Rudenno') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABJOhgBMxDrdpWxAv5izPepCIiU_Fs7K_8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recLrYuJMmjQhS0ig',
    company_role = 'Sales Director',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the G2 recognition. Highest Performer is a great win!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Enterprise AE candidates in the ANZ region. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring Enterprise AEs in ANZ at Zilliz. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jerry Sun') OR linkedin_url = 'https://www.linkedin.com/in/jerry-sun-259b63105')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recM1gtgUGa8R28gf',
    company_role = 'Head of Consultancy - New & Strategic Accounts',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the Sydney HQ growth at Australia Square!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in the HR tech space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.',
    linkedin_connected_message = 'Hope you''re settling in well at Reward Gateway! I see you''re building out the sales team. How are you finding the local talent market? We''re noticing some interesting shifts around AE hires in the employee engagement space, particularly with companies expanding their Sydney operations like yours.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Belma Kubur') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAxESIkBnOObybM8n6bjYULDM1Wb2Pd22dE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recM5hhRdhRrU6x6s',
    company_role = 'Senior Sales Manager Australia, JustCo',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the King Street and Pitt Street locations. Impressive growth!',
    linkedin_follow_up_message = 'We''re working with some excellent sales executive candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in competitive markets.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around sales executive hires in the coworking space. The demand for experienced sales professionals who understand flexible workspace solutions has really picked up lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Damian Wrigley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAALBzWoBh0bvRZ3l3aNQ-nM5VdzBqiEMYeA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recMSnynlGE9Tdmod',
    company_role = 'A/NZ Sales Director',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the CloudTech partnership news. Love the Melbourne traction!',
    linkedin_follow_up_message = 'We''re working with some excellent sales directors at the moment. Companies like HubSpot and Docusign have found our approach helpful when expanding their local teams.',
    linkedin_connected_message = 'I see you''re building out your sales team in Victoria. How are you finding the local talent market? We''re noticing some interesting shifts around senior sales hires in fintech, particularly with companies scaling their presence in Melbourne.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Shane Verner') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABt_AEBAUJbfkEeMtZK7xoPleWzukA84kM')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recMXk401GmZQWOqb',
    company_role = 'Manager, Sales Development APJ',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the monday magic AI tool launch. Love seeing the innovation at monday.com.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong SDR Manager candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring an SDR Manager at monday.com. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Clare Stokes') OR linkedin_url = 'https://www.linkedin.com/in/stokesclare')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recMb6EA7q2mfloVL',
    company_role = 'ANZ Regional Sales Manager',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new Brisbane head office launch. That''s exciting growth!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates in Brisbane at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.',
    linkedin_connected_message = 'I see you''re in a BDR role with all the expansion happening. How are you finding the local talent market? We''re noticing some interesting shifts in the market, particularly around business development hires in Brisbane. With Pax8''s growth trajectory and the new office setup, I imagine you''re seeing some exciting opportunities. Would love to chat about what we''re seeing in the market.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Kelly Johnson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAFSywB9AF90efV2fuZS2bBJ_HsjVzapyY')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recMgAXb1t3I7yEpz',
    company_role = 'Regional Director, ANZ & South Asia ',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the data residency launch. That''s a game changer for enterprise!',
    linkedin_follow_up_message = 'We''re seeing some excellent enterprise sales talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.',
    linkedin_connected_message = 'Hope you''re well Jason! I see GitHub is really doubling down on the enterprise space with the local data residency launch. How are you finding the market with all the regulated sector opportunities opening up? We''re noticing some interesting shifts in the talent market, particularly around enterprise sales hires in the tech space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jason Leonidas') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABZDCMBts13j7W8PeHy0CIpHCNn5elQFaw')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recMh2ubzslvPKiPh',
    company_role = 'Regional Sales Manager - ANZ',
    employee_location = 'Sydney, Australia',
    stage = 'in queue',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $50M funding news. Congrats on the Series C!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in SaaS data protection.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Dave Illman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAkvKgBaMtznMOdYeE8BDEO8g1egFkXTNg')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recMnJZ3ce1OoFnCx',
    company_role = 'Head of Strategic Engagements Amazon Project Kuiper',
    employee_location = 'Queenscliff, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Anthropic partnership news. That''s exciting work at Project Kuiper!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Account Manager candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring Account Managers at Amazon. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ed Layton') OR linkedin_url = 'https://www.linkedin.com/in/ed-layton-27a886a')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recMqudA13nOZPdb9',
    company_role = 'Head of Sales, ANZ',
    employee_location = 'Sydney, Australia',
    stage = 'lead_lost',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the ITEL acquisition news. That''s exciting growth for Nearmap!',
    linkedin_follow_up_message = 'We''re working with some great Commercial AEs in the insurance tech space. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the insurance tech talent market? We''re noticing some interesting shifts in the landscape, particularly around Commercial AE hires in proptech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Drew Plummer') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABT3sRQBzDeovbX3dQCV7ypeVLMZG0k8jU8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recMsLL1I1tbDnutc',
    company_role = 'Customer Success Manager',
    employee_location = 'Adelaide, South Australia, Australia',
    stage = 'connection_requested',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Everoot Consulting acquisition news. Great move expanding the sustainability services.',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in the APAC region at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.',
    linkedin_connected_message = 'I see you''re building out your APAC team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in professional services across Australia.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Christina Mastripolito') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAByqKmAB0kSSsdsLLVoSBOcQZfTMluVgnOo')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recMv8OvQtDdEFHBc',
    company_role = 'Sales Manager',
    employee_location = 'Adelaide, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on being named among the top 30 digital marketing agencies in Sydney for 2025! That''s fantastic recognition.',
    linkedin_follow_up_message = 'We''re working with some excellent Head of Sales candidates across digital marketing.',
    linkedin_connected_message = 'I see you''re building out your team for Zib Digital Australia. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Head of Sales hires in digital marketing.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Rino Crescitelli') OR linkedin_url = 'https://www.linkedin.com/in/rino-crescitelli-03a07b72')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recNCL1WMsEbaQdI5',
    company_role = 'Country Manager - Australia',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new AI lead follow-up features. Love seeing the innovation at Podium.',
    linkedin_follow_up_message = 'We''re working with some great SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in customer communication platforms.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Brad Granger') OR linkedin_url = 'https://www.linkedin.com/in/brad-granger')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recNW2SUgeipGLsSF',
    company_role = 'APAC Commercial Director',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new Sydney data centre launch. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases like yours.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around enterprise AE hiring in Sydney, especially with all the growth happening at Braze right now.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Gerald Tjan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABKA4e4BDxT_Xi4jjYGexGnFn0ib2ovde84')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recNY4MLjdShmAMIp',
    company_role = 'Vice President of Sales',
    employee_location = 'Port Melbourne, Australia',
    stage = 'connected',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the rebrand news. Love the new direction focusing on connection and growth.',
    linkedin_follow_up_message = 'We''re working with some strong SDR candidates in hospitality tech at the moment. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the hospitality tech market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in the sector.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Peter Ferris') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAJ7u4gBy6mWFy5rAgFX6GJLhMEPIXuixsw')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recNcpMTL0A0xRAgA',
    company_role = 'Regional Sales Manager',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the Australia expansion at WEKA!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.',
    linkedin_connected_message = 'I see you''re building out the sales team. How are you finding the talent market across the region? We''re noticing some interesting shifts in the landscape, particularly around SDR hires in the data platform space. The demand for strong sales talent has really picked up with all the AI and data infrastructure growth happening.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('David  Chin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAnQlYcBl3v4LPAPiCUNdaNC2KIKvsEfsTU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recNfAfvnJkWTtrC7',
    company_role = 'Director - Enterprise',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the James Bell appointment. Love the APAC focus at MRI!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team in Melbourne. How are you finding the local talent market? We''re noticing some interesting shifts around Account Manager hires in proptech, especially with all the expansion happening in the region.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Alex Riley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABz4LW8Bu1YPv2BIVLONjd_to4EkALcP31A')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recNjRuHmVh7cOkgK',
    company_role = 'Director of Sales Asia Pacific',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about Mindbody and ClassPass unifying under Playlist. That''s exciting!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong SMB sales candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring SMB Sales Specialists at Mindbody. How are you finding the market? We work with companies like HubSpot on similar outbound roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Allie Mairs') OR linkedin_url = 'https://www.linkedin.com/in/allielue')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recNnWbCqF8cpnBuU',
    company_role = 'Senior Manager of Automation and Robotic Solutions',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about the PoC Centre launch at Western Sydney Uni. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some great Sales Engineers in automation lately. Companies like HubSpot and Docusign have found our approach helpful during growth phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the automation talent market? We''re noticing some interesting shifts in the landscape, particularly around Sales Engineer hires in manufacturing tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Mark Allen') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAARg3V8BI7d2U6G3ojR7ZtHeNqqP5Ze8QbE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recNnXOA4P3EuFnc0',
    company_role = 'Enterprise Account Executive - ANZ',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the SonarQube brand unification news. Smart move bringing everything together.',
    linkedin_follow_up_message = 'We''re working with some strong Enterprise AEs in the DevOps space at the moment. Companies like HubSpot and Docusign have found our approach helpful for these senior roles.',
    linkedin_connected_message = 'I see you''re building out your enterprise team. How are you finding the DevOps sales market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in security and developer tools.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Phil Harris') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAXpQHYBUIYfNu617DcAU5TXq2mxvytHwuA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recNoe6lJ921Rlps6',
    company_role = 'Vice President APAC',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw ClickUp hit $300M ARR. That''s huge! Congrats on the milestone.',
    linkedin_follow_up_message = 'We''re working with some excellent SMB AEs at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases.',
    linkedin_connected_message = 'I see you''re building out your SMB team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in SaaS with your growth trajectory.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ankesh Chopra') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOC7oIBWZPlI-RdNm0J5l4tuXDpSP_onlg')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recNtXAxPmHRYjLFS',
    company_role = 'Senior Vice President Business Development',
    employee_location = 'Brisbane City, Queensland, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new Brisbane head office launch. Exciting local expansion!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates in Brisbane at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around BDR hiring in Brisbane, particularly with the tech expansion happening there.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Chris Sharp') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABBDdkB_SkNbaG77cj2ezLqZu1WwFaMITk')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recO8qXHvo5GH4BFt',
    company_role = 'Regional Sales Manager',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Melbourne PartnerTrust event. Great partner momentum!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AEs who have strong public sector experience at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their government facing teams.',
    linkedin_connected_message = 'Hope you''re well Simon! I see you''re building out the public sector team. How are you finding the market with all the new compliance requirements? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise AE hires who understand government frameworks. The IRAP certification news must be opening up some great opportunities for you.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Simon Hickson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAArmqP8B9CJzz3P71JPu1MHEwr_5zYzxSQM')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recOSGz78aiZDoTFW',
    company_role = 'Sales Manager, MSP',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the Sydney office opening at Australia Square Plaza!',
    linkedin_follow_up_message = 'We''re working with some excellent account management talent in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when expanding their local teams.',
    linkedin_connected_message = 'Hope you''re settling in well at the new Sydney office! How are you finding the local talent market as you build out the team there? We''re seeing some interesting shifts in the market, particularly around account management and sales hires in the data security space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Andrew Browne') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACODrt0B9dHaBUVWT_wmasxZV1Z2dbJyWQA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recOTy4d9oNCZOHiX',
    company_role = 'Regional Vice President',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $270M funding news. Congrats on the massive round!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in observability and SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Francesca M.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAciFtYBNr4jws-GVg6DhS5yu9d2VSVxB1A')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recOlDVQe1O0BVj0M',
    company_role = 'Head of Sales, ANZ',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Series D news. Congrats on the $150M funding!',
    linkedin_follow_up_message = 'We''re working with some strong SDR candidates in cybersecurity at the moment. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your SDR team. How are you finding the cybersecurity talent market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in GRC and compliance.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Emlyn Gavin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABA0BdEBOjlnr8yUMmZNOJg8TUTfAhRYSFY')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recOmQC6qHao1KlXw',
    company_role = 'Regional Sales Director APAC',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about Planful''s expansion into Germany and doubling the UK footprint. That''s exciting growth!',
    linkedin_follow_up_message = 'We''re working with some strong SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the SDR market? We''re noticing some interesting shifts in the talent landscape, particularly around sales development hires in SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Richard Ford') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAC6F8ABJNTZy_TQ1GyavCFvWuLojnlx11I')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recPSWYRRbUh2sE83',
    company_role = 'National Sales Manager',
    employee_location = 'Noble Park, Victoria, Australia',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the ATS acquisition news. Exciting move for Melbourne operations!',
    linkedin_follow_up_message = 'We''re working with some excellent sales professionals in the industrial sector at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling teams after acquisitions.',
    linkedin_connected_message = 'Hope you''re settling in well post acquisition. How are you finding the talent market as you scale the sales team? We''re seeing some interesting shifts around industrial sales hires in Melbourne, particularly with companies expanding their local operations like Tyrolit.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Cameron McLean') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAEtunhoB-Tr9CmP6fxP5uhO7JhbN3-6uyfU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recPVUmb6KS9d6FWg',
    company_role = 'VP Revenue APAC',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the WorkSafe Guardian and Reactec acquisitions. Love seeing the EHS expansion!',
    linkedin_follow_up_message = 'We''re working with some great Account Managers in the safety and compliance space. Companies like HubSpot and Docusign have found our approach helpful during growth phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market with all the expansion happening? We''re noticing some interesting shifts in the talent landscape, particularly around Account Manager hires in the safety tech space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Damien McDade') OR linkedin_url = 'https://www.linkedin.com/in/damien-mcdade-83b485375')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recPbocNDRWzov5he',
    company_role = 'Director Customer Relations & Sales, South East Asia',
    employee_location = 'Singapore',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Gartner Magic Quadrant recognition. Congrats on being named a Challenger!',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Executives in the data space at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Executive hires in data platforms and enterprise tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Stella Ramette') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAXyqu0B0CJUPWCupyEprECOEG4C2ud5USg')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recPdwewtvRIjIQ6T',
    company_role = 'Senior Business Development Manager',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Indue acquisition news. That''s exciting consolidation!',
    linkedin_follow_up_message = 'We''re working with some excellent BD candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your commercial team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the landscape, particularly around Business Development hires in fintech and payments.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Stefan Ellis') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAARdBWMBtDKClRUttSAPcjdVpyK3eJmwsLM')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recPhd3PZlByZmWIX',
    company_role = 'Executive Director, ANZ',
    employee_location = '',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Mira AI launch at the Summit. That''s exciting stuff!',
    linkedin_follow_up_message = 'We''re working with some great BDR candidates at the moment. We helped HubSpot and Docusign with similar roles during their scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around BDR hires in media intelligence and SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('David Hickey') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAALXTBsBfgTRk7DI_wcShCZfWQpoIjE4BSs')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recPjYT5TcmgJBgee',
    company_role = 'Vice President of Business Development, APAC',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the GenieAI expansion plans. Great move for the Sydney office!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around SDR hiring in Sydney, particularly with all the GTM expansion happening at tech companies like Bigtincan.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('David Chapman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAzGmOYBnH-p0M8MaqRqn3Urbzfm9K2GcCg')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recPkOCgzJsSnfl6I',
    company_role = 'Head of Microsoft Singapore',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the AI governance platform launch. Love seeing Wild Tech innovating in that space.',
    linkedin_follow_up_message = 'We''re working with some strong BDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market for BDR talent? We''re noticing some interesting shifts in the landscape, particularly around enterprise-focused BDR hires in tech services.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Tiffany Ong') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAC-xkRUBefmpBmPEewE2wzIycV2STykoqvs')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recPkP3iUMobkwwc3',
    company_role = 'Regional Sales Manager',
    employee_location = 'Pelican Waters, Queensland, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the Singapore EDB partnership. Smart APAC expansion move!',
    linkedin_follow_up_message = 'We''re working with some excellent Mid Market AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling across APAC markets.',
    linkedin_connected_message = 'I see you''re building out your Mid Market AE team. How are you finding the talent market across the region? We''re noticing some interesting shifts in the landscape, particularly around experienced AE hires in cybersecurity. The APAC expansion through Singapore is exciting timing with all the AI security demand we''re seeing.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('David Helleman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKaCvgB327GG3yyjVQL2FeuWKM2unL9MW8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recPqviwppD3bMyIv',
    company_role = 'ANZ Director of Account Managers | Local Government and Housing | Civica APAC',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about Christopher Smith joining as APAC MD. That''s exciting for the expansion!',
    linkedin_follow_up_message = 'We''re working with some great AE candidates with local government experience at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local government market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in the public sector space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Luke McCarthy') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAJXC9MB_HN2OMXQxDFCk0u0SLG-_eghdUU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recPrl9inZ1Glb0nJ',
    company_role = 'Sales Director - Overseas Revenue & Channel',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about the corporate restructure and new board appointments. Smart move to strengthen the team.',
    linkedin_follow_up_message = 'We''re working with some great SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the HR tech talent market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jonathon McCauley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABI7n6ABBU7ZtUaDgXXqKkZXyDL_2iHLqrI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recPsPgH8dtrMOvAH',
    company_role = 'Sales Director, ANZ',
    employee_location = '',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Mira AI launch at the Summit. That''s exciting stuff!',
    linkedin_follow_up_message = 'We''re working with some great BDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around BDR hires in media tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Theo McPeake') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABDf5kABvuQIkoh3JBPi4Wsgj_VWMd9RiQk')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recPw0cbrwdMvBOBI',
    company_role = 'Senior Manager, Channel Sales and Alliances for APJ',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the APAC expansion focus. 27% market growth is huge!',
    linkedin_follow_up_message = 'We''re working with some excellent strategic AE candidates at the moment who have deep enterprise software experience. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC teams.',
    linkedin_connected_message = 'I see you''re building out your strategic sales team across Sydney and Melbourne. How are you finding the talent market in the region? We''re noticing some interesting shifts around strategic AE hires, particularly with companies scaling their APAC operations. The containerization space is moving fast and finding the right enterprise sales talent who can navigate that complexity seems to be the challenge everyone''s talking about.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Martin Cerantonio') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACBWQ4BsBoCjhpihPpsaKPuJzXBf7u7opQ')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recQRKv6RJFbENhnS',
    company_role = 'Field Sales Director, Western Australia & Asia',
    employee_location = 'Greater Perth Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love Info-Tech''s commitment to the Sydney market. Hope you''re well!',
    linkedin_follow_up_message = 'We''re working with some excellent account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.',
    linkedin_connected_message = 'I see you''re building out your account management team. How are you finding the talent market? We''re noticing some interesting shifts around senior account manager hires in the tech research space, particularly with companies scaling their ANZ presence.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Praba Krishnan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADzZ_QBZgSFXXp38D2045XQcqQ9I56w1P0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recQYhqcHLbmbazYf',
    company_role = 'Managing Director, Asia Pacific & Middle East',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney office launch news. Congrats on leading the expansion! That''s exciting to see Carta establishing local operations.',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.',
    linkedin_connected_message = 'Hope you''re settling in well with the Sydney launch. How are you finding the local talent market as you build out the team? We''re seeing some interesting shifts in the market, particularly around sales development hires in fintech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Bhavik Vashi') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAtjo3ABodnUAb0M_AJJ6dItjjbIYtUN5F8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recQfOI4QymR3rqyj',
    company_role = 'Regional Sales Manager',
    employee_location = 'Greater Sydney Area',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the MiClub win. Half of Australia''s golf clubs is quite the achievement!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams in this market.',
    linkedin_connected_message = 'I see you''re building out your enterprise sales team. How are you finding the talent market? We''re noticing some interesting shifts in the landscape, particularly around senior AE hires in the cloud infrastructure space. With all the growth happening in APAC, it''s becoming quite competitive for top enterprise sales talent.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Colin Stapleton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAARUC0BN-Z3aOd0BYZfffvwRNg2tZvutUg')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recQlFBEc6g3VQTla',
    company_role = 'Manager - Sales Development, Australia & New Zealand',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Stripe Tour Sydney event. That''s exciting growth!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales development teams.',
    linkedin_connected_message = 'I see you''re building out your SDR team. How are you finding the local talent market? We''re noticing some interesting shifts around sales development hires in Sydney, particularly with the growth you''re seeing at Stripe. Over a million users in AU/NZ is impressive momentum.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Aleks Kakasiouris') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAc7ZUcB_rICSouYWKqvrDgMAWRJyK6nc60')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recQslYokcb6MkvuM',
    company_role = 'Sales Director',
    employee_location = 'Melbourne, Australia',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about Hyland''s rebrand in March. Love the AI automation pivot!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in the automation space at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the APAC market for new business development? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in enterprise automation and AI.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Stanley Chia') OR linkedin_url = 'https://www.linkedin.com/in/stanleychia')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recR17tEl7dE1entP',
    company_role = 'Senior Vice President of Sales, APJI',
    employee_location = 'Greater Sydney Area',
    stage = 'in queue',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the international expansion focus at Sprinklr!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during international scaling phases.',
    linkedin_connected_message = 'I see you''re building out your enterprise SDR team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around senior SDR hires in the CX space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Basil Botoulas') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABfbCsBoW2Bzka0GyR4nxYRSkPCzvyhI1g')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recR2tbiEKWJq3dd0',
    company_role = 'Country Manager, Australia & NZ',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the X4 Sydney Summit news. Love seeing the new AI tech launch.',
    linkedin_follow_up_message = 'We''re working with some great Partner Sales Managers at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.',
    linkedin_connected_message = 'I see you''re building out your partner team. How are you finding the partner sales market? We''re noticing some interesting shifts in the talent landscape, particularly around Partner Sales Manager hires in SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Alex Nemeth') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKzBZIB8mfThsIR4XMC6xBnC_Zf2o3Ka5E')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recR6BDFkX725gzwN',
    company_role = 'Director Growth & Partnerships APJ',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Great to connect Paul! Love seeing growth and partnerships leaders driving expansion across the APAC region.',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Director candidates across enterprise software.',
    linkedin_connected_message = 'I see you''re building out your team for Think & Grow. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in enterprise software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Paul Mitchinson') OR linkedin_url = 'https://www.linkedin.com/in/paul-mitchinson-8a4a06129')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recR8iqLtEZVjlc1V',
    company_role = 'Enterprise Sales Manager',
    employee_location = 'Perth, Western Australia, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Weir acquisition news. That''s huge for Perth!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise sales candidates in Perth at the moment. Companies like HubSpot and Docusign have found our approach helpful during major growth phases like this.',
    linkedin_connected_message = 'Hope you''re well Jason! I see you''re building out the enterprise sales team. How are you finding the local talent market with all the growth happening? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales hires in mining tech. The acquisition must be creating some exciting opportunities for the team.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jason Ogg') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAuayowBpHsQMxgUNYX7bw3e4UZbpfhq_DE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recR9WC8sutfWbi4o',
    company_role = 'Senior Regional Sales Director',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on HCLTech being recognised as Dell Technologies'' 2025 Global Alliances AI Partner of the Year! That''s fantastic news.',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Director candidates across enterprise software if you''re looking externally.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in enterprise software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Vinod Venugopal') OR linkedin_url = 'https://www.linkedin.com/in/vinod-venugopal-72038512')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recRBJExkjmk8tQxi',
    company_role = 'Senior People Business Partner, APJ',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about your CRM hitting $100M run rate. That''s exciting!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong SDR Manager candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring an SDR Manager at monday.com. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Bridie Rees') OR linkedin_url = 'https://www.linkedin.com/in/bridierees')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recRHOa9593vDsWWv',
    company_role = 'Sales director',
    employee_location = 'Redfern, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the KuppingerCole leadership recognition!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent market, particularly around enterprise sales hires in identity management. The demand for experienced AEs who understand complex security solutions has really picked up lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Thomas Nguyen') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAF5SEpABBgPXE1tn0kxcv8PV2qx3AQlcVYw')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recRT8mNUIo7USXXR',
    company_role = 'National Sales Manager - Adaptalift Access Rentals',
    employee_location = 'Greater Brisbane Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new electric forklift launch. Love the sustainability focus!',
    linkedin_follow_up_message = 'We''re working with some excellent account management candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.',
    linkedin_connected_message = 'I see you''re building out your sales team at Adaptalift. How are you finding the Melbourne talent market? We''re noticing some interesting shifts in the market, particularly around account management hires in the materials handling space. The focus on sustainability and safety tech seems to be driving some great conversations with candidates.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('John Delbridge') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAN4B1YB344JnhZ5c9G2WE4lYLzX6ILcAPM')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recRYwkvxIXzER0at',
    company_role = 'Chief Customer Officer',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about your New Zealand expansion with Endeavour and Thyme Technology. Great move into the Kiwi market!',
    linkedin_follow_up_message = 'We''re working with some excellent Partner Sales Managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their partner functions.',
    linkedin_connected_message = 'I see you''re building out your partner sales team. How are you finding the market for partner-focused roles? We''re noticing some interesting shifts in the talent landscape, particularly around Partner Sales Manager hires in the ERP space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ron Gounder') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAL66VMBzz4J9xphbUqG-QZzdiaYFvihk08')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recRmKP141sKW0u3W',
    company_role = 'General Manager of Sales',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the ongoing Melbourne recruitment drive. Hope it''s going well!',
    linkedin_follow_up_message = 'We''re working with some excellent sales professionals in the Melbourne market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their commercial teams.',
    linkedin_connected_message = 'I see you''re building out your sales team at Adaptalift. How are you finding the local talent market in Melbourne? We''re noticing some interesting shifts in the talent landscape, particularly around sales and account management hires in the materials handling space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Adam Duncan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABIRrgMBeRq8C32gXuza-3DnpydClkc6kgI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recRygiNX8MCT1Ldz',
    company_role = 'Sr. Manager, Channel Sales | Partnerships, Alliances and Channel - APAC ',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love what Vimeo''s doing in the enterprise video space.',
    linkedin_follow_up_message = 'We''re working with some excellent senior AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market for senior AE talent? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales hires in the video tech space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Gary Zeng') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAvsStkBrpcODglXSqC1jpHE7Z_QsvKCNHo')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recSAqqPakctWG82e',
    company_role = 'VP Sales, APAC',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $152.5M funding news. Congrats on the round!',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise Sales Executives in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the enterprise sales market in fintech? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise Sales Executive hires in treasury and payments.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Aidan McDonald') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAtP-LQB2y4WMsUQ6IY4j4uY3issCqvL2QA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recSNJnFxhTz2BH5F',
    company_role = 'SVP Sales AU/NZ',
    employee_location = 'Australia',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Reece partnership news. That''s a massive win for the ANZ team!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in competitive markets.',
    linkedin_connected_message = 'Hope you''re well Tim! I see you''re building out your team. How are you finding the local talent market after that big Reece win? We''re noticing some interesting shifts in the talent market, particularly around Account Manager hires in payments. The demand for experienced AMs who understand unified commerce is really heating up. Would love to chat about what we''re seeing if you''re open to it.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Tim McDonnell - SVP Sales') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAG4k7wBi1m1-umvMJccP4o3Zl4sFOO21aM')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recSeScFrr9sO0qqy',
    company_role = 'Regional Sales Director, ANZ',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $270M funding news. Congrats on the round!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in observability and SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('James Hayward') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFVz2oBlYf7WzWxpqZ8nxrAaXjzFfo-OzU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recSeWS3cXVkz7Jjp',
    company_role = 'Sales Director - APJ',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Melbourne office expansion. Exciting growth in ANZ!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.',
    linkedin_connected_message = 'I see you''re building out your team in Melbourne. How are you finding the local talent market since the office expansion? We''re noticing some interesting shifts in the market, particularly around Account Executive hires in the privacy and compliance space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Blair Hasforth') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADWE7oB1FD64dzt9CaP8Mgmkzw2Yt1FjvQ')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recSprmCXhYxtzBqN',
    company_role = 'Head of Sales & GTM | Cap Tables & PE | APAC & MENA',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney office launch news. That''s exciting to see Carta establishing a local presence here!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.',
    linkedin_connected_message = 'Hope you''re settling in well at Carta! How are you finding the local talent market as you build out the Sydney team? We''re seeing some interesting shifts around SDR hiring in the fintech space, particularly with companies establishing their first local operations.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Charlie Pennington') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAZfnxoBbtSFoNGub--1Onpu97IEnac1TF8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recSq4OnWz9d1o4J8',
    company_role = 'Vice President',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'in queue',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Anacle acquisition news. Great APAC expansion!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.',
    linkedin_connected_message = 'I see you''re building out your sales team in Melbourne. How are you finding the local talent market? We''re noticing some interesting shifts around Account Manager hires in proptech, especially with all the expansion happening in the space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Richard Exley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAkYxXMB1Zhtw85yzw5Dk-3D0NxL9MuEgyk')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recT0VOYPWVuGqUw5',
    company_role = 'Supplier Sales Manager',
    employee_location = 'Greensborough, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Great to connect Kyle! Love seeing the growth at E1 across the APAC region.',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates across enterprise software.',
    linkedin_connected_message = 'I see you''re building out your team for E1. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Kyle Baker') OR linkedin_url = 'https://www.linkedin.com/in/kyle-thomas-baker')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recTEZZD0NEh89ZJz',
    company_role = 'Country Sales Manager',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the ANZ expansion plans. Exciting growth ahead!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Executive candidates at the moment, particularly those with enterprise data experience. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams during growth phases.',
    linkedin_connected_message = 'I see you''re building out your team in Sydney. How are you finding the talent market with all the expansion happening? We''re noticing some interesting shifts in the landscape, particularly around Account Executive hires in the data transformation space. Would love to share what we''re seeing and hear your thoughts on the local market dynamics.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Abhishek Nigam') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAIfh94BHkk8hLf3tbr6NUYHp0kXiYJk53E')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recTEaeGQAQdFajEx',
    company_role = 'Strategic Sales Manager - SG, MY, PH',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the TikTok Shop launch! That''s been such an exciting development to watch.',
    linkedin_follow_up_message = 'We''re working with some excellent BDM candidates across tech.',
    linkedin_connected_message = 'I see you''re building out your team for TikTok. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around BDM hires in tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Melissa Kiew') OR linkedin_url = 'https://www.linkedin.com/in/melissakiew')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recTKXlOXwImV7ZnV',
    company_role = 'Sales Director, Australia & New Zealand',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the AXIUM CX9000 launch. Love seeing the innovation in payments tech.',
    linkedin_follow_up_message = 'We''re working with some strong Account Directors in payments at the moment. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the payments talent market? We''re noticing some interesting shifts in the landscape, particularly around Account Director hires in fintech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Mark Gosney') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACNIHEYBcuR9nj0mOxmHSGEOu2hCK6084W0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recTMuCDsidOkGJj7',
    company_role = 'Team Lead - APAC',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the five HotelTechAwards wins! That''s fantastic recognition for the team.',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Director candidates across SaaS if you''re looking externally.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Kenneth Yeo') OR linkedin_url = 'https://www.linkedin.com/in/kennethyeoideas')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recTXESaNl5pQJaHv',
    company_role = 'Sales Director',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing Reward Gateway''s Sydney office growth as the Australian HQ!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Executive candidates in the employee engagement space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in employee engagement. The demand for experienced AEs who understand the local market dynamics has been really strong lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Kylie Terrell') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAYnjxUByubGwx8my9yZnyg_OBR5ridC98Y')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recTaixdewDw9YJcT',
    company_role = 'Regional Sales Manager',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the Australia hiring push at WEKA. Exciting growth phase!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases in Australia.',
    linkedin_connected_message = 'Hope you''re settling in well at WEKA! I see you''re building out the sales team across Australia. How are you finding the talent market for SDR hires? We''re noticing some interesting shifts in the market, particularly around enterprise sales development roles in the data platform space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Eunice Zhou') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAArP78ABdnTtt4D89VKQKU1y4O_S5Z6eLk4')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recTrlBWIIblCqFqv',
    company_role = 'Director, Field Sales',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the inaugural Protect Tour in Sydney. That looked like a great event!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams in the region.',
    linkedin_connected_message = 'I see you''re building out your BDR team across APAC. How are you finding the local talent market in Sydney? We''re noticing some interesting shifts in the market, particularly around business development hires in cybersecurity. The partner expansion you''ve been doing locally seems to be creating some good momentum.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Rj Price') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEZNsoBONZoaTMWdtCIGAEfsz3vZZkfH3M')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recTt5zewH8rolff3',
    company_role = 'Regional Director',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the partner bootcamps in Sydney. Great local investment!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in the cybersecurity space at the moment. Companies like HubSpot and Docusign have found our approach helpful during their local expansion phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in Sydney''s identity security space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Sean Walsh') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAYS8YBMkbqMtS4ixw10qimlev-rNnsb7c')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recTxhXKXdBYpbxuw',
    company_role = 'Head of Channel APJ',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Work Innovation Summit in Sydney. That''s exciting stuff!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.',
    linkedin_connected_message = 'I see you''re building out your BDR team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent space, particularly around sales development hires in the work management space. The demand for quality BDRs has really picked up since companies are focusing more on pipeline generation.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jo Gaines') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABJiAUBly92h53-BiBUxcXFJMoMSvNa15Y')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recU1KSmEEknWSDX1',
    company_role = 'Regional Partner Manager',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $50M funding news. Congrats on the Series C!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in SaaS data protection.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Houman Sahraei') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAVJz1cBS6pbRJJ9c3IOCA0lKSZ5e3AFEZI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recU5tQ3owKu5VZgN',
    company_role = 'VP Commercial Operations',
    employee_location = 'Greater Adelaide Area, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about the SpaceX satellite launch and the $32M funding round. That''s exciting growth for Myriota!',
    linkedin_follow_up_message = 'We''re working with some strong SDR candidates in the tech space at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid growth phases.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the market for SDR talent in IoT? We''re seeing some interesting shifts in the tech space, particularly around Sales Development Associate hires as companies scale internationally.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Nicole Russo') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEX0ygB1kHkM8_FGZdQLzx3fvf8OPgOQt8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recU9C98pNnTG3he0',
    company_role = 'APAC Sales Vice President - Digital Security Solutions',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Onfido acquisition news. Great move for the APAC expansion!',
    linkedin_follow_up_message = 'We''re working with some excellent government sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.',
    linkedin_connected_message = 'I see you''re building out your government sales team. How are you finding the talent market across the region? We''re noticing some interesting shifts in the landscape, particularly around senior sales hires in cybersecurity.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Marc AIRO-FARULLA') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAARD2gcBeM9MU-k8mh27GWW8OGtwa37QKYE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recU9epPzC3BPCyFL',
    company_role = 'Senior Business Development Manager',
    employee_location = 'Brisbane, Queensland, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw RIB''s work on the Sydney Metro project. Impressive local impact!',
    linkedin_follow_up_message = 'We''re working with some excellent sales leaders in the construction tech space at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out their APAC teams.',
    linkedin_connected_message = 'I see you''re looking at the Sales Director role. How are you finding the local talent market? We''re noticing some interesting shifts in the sales hiring space, particularly around senior APAC roles in construction tech. The demand for leaders who understand both the technical side and the regional market dynamics has really picked up.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Darren Bowie') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAB54KokB8IDOPpN99aoyKTufZ4xqMVWTYmU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recUBQeie6NqioUwY',
    company_role = 'Enterprise Sales Lead - APAC',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the ESET Connect 2025 workshops. Love the partner enablement focus!',
    linkedin_follow_up_message = 'We''re working with some excellent channel sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their partner teams.',
    linkedin_connected_message = 'Hope you''re well Terence! I see you''re building out the channel team. How are you finding the partner sales talent market? We''re noticing some interesting shifts in the talent space, particularly around channel sales hires in cybersecurity. The partner enablement work you''re doing sounds exciting.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Terence T.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABKiCb4BprKIrAdvTq6hryWeYhz0_o3zUGA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recULu6090SCPVCup',
    company_role = 'Director, Sales Development Asia Pacific & Japan',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney office expansion at Australia Square. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in cybersecurity. With Darktrace doubling headcount across Sydney, Melbourne, and Perth, you must be seeing some unique challenges in scaling the sales team.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jeff Yeoh') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOu-CYBdGLDEgENcsaRq0r0DtK-jN_B40g')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recUgjRpSWe3LJxdi',
    company_role = 'Vice President, APAC',
    employee_location = 'Singapore',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Shadow AI Report. Great insights on local AI governance risks!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in the SaaS security space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams during growth phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the talent market in Sydney? We''re noticing some interesting shifts around Account Executive hires in the SaaS security space, especially with all the AI governance conversations happening locally.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Gary Saw') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAJNVu8BJVwDvyZiFcbEFviME0Jd_G_niVA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recUn204rEUlRJCuV',
    company_role = 'Chief Revenue Officer',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $250M ARR milestone. That''s exciting growth!',
    linkedin_follow_up_message = 'We''re seeing some strong SDR talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their inbound teams.',
    linkedin_connected_message = 'I see you''re building out your SDR team. How are you finding the talent market in Sydney? We''re noticing some interesting shifts around inbound sales hires, particularly with all the growth happening in HR tech right now.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Kevin Rawlings') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABpiT_cB0dsrxE6ZJKaVjoF_u7710jm2v7o')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recUoGB2snfBCFxsN',
    company_role = 'Enterprise Account Director',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the LevelBlue acquisition news. Exciting expansion across APAC!',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AE candidates in cybersecurity at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the talent market across the region? We''re noticing some interesting shifts in the cybersecurity space, particularly around Enterprise AE hires with the consolidation happening in managed security services.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('John Aguilar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAabEGwBUGUzwkySMSk0et_bdm33b9jvuAo')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recUqx3fw3CSXDmI5',
    company_role = 'Senior Vice President ANZ',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about PROLIM''s expansion into ANZ through the Edge PLM acquisition. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some great inside sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.',
    linkedin_connected_message = 'I see you''re building out your inside sales team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around inside sales hires in manufacturing tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Kris H.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACf8LQBA2vs4yBy8Q-YopQav7uHzRVLsg0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recV43UMRTfyNLHxs',
    company_role = 'General Manager, Supplier',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw Ordermentum hit $2 billion in transactions. Incredible milestone! Congrats on the achievement.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Sales Enablement candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see Ordermentum is hiring a Sales Enablement Manager. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Kayur Desai (KD)') OR linkedin_url = 'https://www.linkedin.com/in/kayur-desai-kd')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recV5UeBE3v0UfAAx',
    company_role = 'Partner, Technology Consulting',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about KPMG''s $80M AI investment program. That''s exciting for tech consulting.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Salesforce leaders at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Salesforce Director at KPMG. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Olivia Willee') OR linkedin_url = 'https://www.linkedin.com/in/oliviawillee')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recVVqQA04bA8foFo',
    company_role = 'SVP Operational Intelligence, R&D Technology',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the Nexus Black AI accelerator launch. Exciting stuff!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong presales candidates in the AI space. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Presales Consultant for AI Growth at IFS. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Grant Eggleton') OR linkedin_url = 'https://www.linkedin.com/in/grant-eggleton')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recVXG8vZWpkDtJEL',
    company_role = 'CCS Solution Success Director - APAC',
    employee_location = 'Greater Melbourne Area, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw FICO Platform won the Business Intelligence Platform of the Year award. Congrats on the recognition!',
    linkedin_follow_up_message = 'We''re working with some experienced Key Account Managers at the moment. Companies like HubSpot and Docusign have found our approach helpful for similar roles.',
    linkedin_connected_message = 'I see you''re building out your Key Account Management team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around account management hires in fintech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Darryn Cann') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAdtpg0BuA5bPVZzGUxzgFz1yg0lahczae8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recVbIu3HXyxoTT4b',
    company_role = 'Regional Sales Manager, APAC',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the mega deals news. Congrats on the strong Q2!',
    linkedin_follow_up_message = 'We''re working with some strong candidates in the TMT consulting space.',
    linkedin_connected_message = 'I see you''re hiring for the TMT Service Line Specialist role at Cognizant. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Simon Dougall') OR linkedin_url = 'https://www.linkedin.com/in/simon-dougall-9a76022')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recVdMywHW3xi8QJC',
    company_role = 'Managing Director',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about the UNSW TRaCE partnership. Love seeing the focus on clean energy tech.',
    linkedin_follow_up_message = 'We''re working with some excellent Business Development Managers in industrial automation at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the industrial automation market? We''re noticing some interesting shifts in the talent landscape, particularly around Business Development Manager hires in the automation space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Russell Palmer') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACtfA0Bi_LljWCaTSXo3h9IOC1I6JjhOQ4')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recVeYbWO7aiqnyA4',
    company_role = 'Head of Strategic Growth',
    employee_location = 'Manly, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Indue acquisition news. That''s a big move for the payments space!',
    linkedin_follow_up_message = 'We''re working with some excellent business development candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.',
    linkedin_connected_message = 'I see you''re building out your business development team. How are you finding the Sydney talent market with all the growth happening at Cuscal? We''re noticing some interesting shifts in the talent landscape, particularly around BD hires in fintech, especially with companies going through major expansions like yours.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Rebecca Tissington') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA2DDFoBRAQ4FgVX8bmtNWBI51O2-HJkAwM')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recVhkOS6mdaMmqwv',
    company_role = 'Enterprise Account Director',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Tech Data partnership announcement. Great move for the ANZ market!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AE candidates who have strong government experience at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out specialized teams.',
    linkedin_connected_message = 'Hope you''re well Marcel! I see you''re focused on the federal government space. How are you finding the market with all the AI adoption conversations happening? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise AE hires who understand the government sector. The regulatory requirements make it such a specialized area.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Marcel Pitt') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABL5jkBcw2_leSGFicYww-jrL0zNHZ15yY')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recVuTTPMjre0pdzP',
    company_role = 'Regional Vice President, Sales',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'in queue',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Diligent Connections event coming to Sydney. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR and sales candidates in the GRC space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their business development teams.',
    linkedin_connected_message = 'Hope you''re well Andrew! I see you''re in the BDR role at Diligent. How are you finding the market for GRC solutions in Sydney? We''re noticing some interesting shifts in the talent space, particularly around business development hires in the compliance and governance sector. Would love to chat about what we''re seeing.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Andrew Amos') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAhmFyEBxNGGcz8NYgANX3_Zl7W176_MEzE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recW5EEcEPejLQr8U',
    company_role = 'Sales Director',
    employee_location = 'Carlton, Victoria, Australia',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Deputy Payroll launch from Sydney HQ. That''s exciting!',
    linkedin_follow_up_message = 'We''re seeing some strong account management talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.',
    linkedin_connected_message = 'Hope you''re well! I see Deputy''s expanding the platform with the new payroll launch. How are you finding the Sydney market as you scale into these new verticals? We''re noticing some interesting shifts in the talent market, particularly around account management hires in workforce tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Zeek Ahamed') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACbi_gMBw32I2uFNhXMH_4ry20bpfKnsFMw')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recW8GWxVfjCXrLJz',
    company_role = 'Account Director - APAC',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the OnBoard AI launch. Love seeing the board governance space getting some innovation.',
    linkedin_follow_up_message = 'We''re working with some strong SDR candidates in the compliance space. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in governance tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Justin Kumar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABcg8rYBv_-JsMsLfWAj1ey_38O-XFzMEro')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recWbkmCZPSbZLzcW',
    company_role = 'Regional Sales Director APAC',
    employee_location = 'New Port, South Australia, Australia',
    stage = 'in queue',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Melbourne office. Love the local presence!',
    linkedin_follow_up_message = 'We''re working with some excellent renewals and customer success candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their retention teams.',
    linkedin_connected_message = 'I see you''re building out your renewals team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around customer success and renewals hires in the analytics space. The demand for strong renewals managers has really picked up lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Matthias Hauser') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAe4FegBoXgyPa40RNaX3DoVTnl68MrMcgI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recWrWT9sjmfy72Xr',
    company_role = 'Territory Manager NSW/ACT',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about Jo Masters joining as MD at Baidam. Exciting times ahead!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Territory Manager candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re expanding the Territory Manager team at Baidam. How''s it going with the new leadership? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Mick Brennan') OR linkedin_url = 'https://www.linkedin.com/in/mick-brennan-5694b63a')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recWuuzxyqJ9dmUzs',
    company_role = 'General Manager',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing Madison''s growth in the Sydney market!',
    linkedin_follow_up_message = 'We''re working with some excellent strategic account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around strategic account manager hires in the IT services space. The Sydney market has been pretty competitive lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Craig Moulin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA1k0soBc-cSa1UpfM6XE7mo7JV3v15so7k')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recX6KaZhX8iULgTE',
    company_role = 'Regional Sales Manager',
    employee_location = 'Greater Brisbane Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new Brisbane head office launch. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates in Brisbane at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around BDR hires in the cloud space. The Brisbane market has been quite active lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('David Knapp') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAe2JNkB2vv_Bt6sdOqHIkwnTBgZ_LFzb4U')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recX9UXlMexJJG5vn',
    company_role = 'Regional Director, APAC',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the partnership news with ADS Solutions. Great move expanding into wholesale distribution.',
    linkedin_follow_up_message = 'We''re working with some strong Technical Presales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the technical presales market? We''re noticing some interesting shifts in the talent landscape, particularly around Technical Presales hires in data analytics.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Craig Medlyn') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAciz48BT5_FJpB_thV1vmKo7APTHb6BQb0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recXLlPst3eiT9anW',
    company_role = 'Regional Sales Director',
    employee_location = 'Millers Point, New South Wales, Australia',
    stage = 'connected',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw OPSWAT at the Sydney Security Exhibition. Great local presence!',
    linkedin_follow_up_message = 'We''re working with some excellent cybersecurity sales managers in the Sydney market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their regional teams.',
    linkedin_connected_message = 'I see you''re building out your team in Sydney. How are you finding the local cybersecurity talent market? We''re noticing some interesting shifts in the talent landscape, particularly around sales manager hires in the cybersecurity space. With OPSWAT''s strong local presence through events like the Security Exhibition and OT Cyber Resilience Summit, you''re probably seeing the demand for quality talent firsthand.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ian Berkery') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAHUvyUBu9nKhYs1XURqQZ5ev--qSBKMKDA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recXLpE9zwrEMHXGW',
    company_role = 'Head of APAC Partnerships',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the Surry Hills office expansion. That''s exciting growth!',
    linkedin_follow_up_message = 'We''re seeing some excellent account management talent in the Sydney market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.',
    linkedin_connected_message = 'I see you''re scaling the sales team in Sydney. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around account management hires in the SaaS space. The Launchpad community has been sharing some great insights about what''s working in Sydney right now.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Keith Chan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAzTTocB58LARl1bZUouDzhX5UYmdDxlSF0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recXNH4JVf6DjTdaj',
    company_role = 'Sales Manager',
    employee_location = 'Singapore, Singapore',
    stage = 'connected',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on closing the AIB Merchant Services acquisition! That''s fantastic news for the European expansion.',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Director candidates across fintech if you''re looking externally.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in fintech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Coreen Chia') OR linkedin_url = 'https://www.linkedin.com/in/coreen-chia')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recXOkfm1HFZLxhMN',
    company_role = 'Partner, Growth',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Great to connect Tim! Love seeing growth partners driving strategic expansion in the market.',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Director candidates across enterprise software.',
    linkedin_connected_message = 'I see you''re building out your team for Think & Grow. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in enterprise software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Tim Clark') OR linkedin_url = 'https://www.linkedin.com/in/timcwclark')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recXUSd7NR8uN6n4H',
    company_role = 'Sales Director Australia & New Zealand ',
    employee_location = 'Greater Brisbane Area, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Frost Radar Leader news for MDR. Congrats on the recognition!',
    linkedin_follow_up_message = 'We''re working with some experienced Sales Managers in cybersecurity at the moment. We helped HubSpot and Docusign with similar roles during their growth phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the cybersecurity talent market in ANZ? We''re noticing some interesting shifts, particularly around Sales Manager hires in enterprise security.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Soumi Mukherjee') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACsja8By4ORabsg6shBgP8MFUfy8eebGLc')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recXf9kd6aBO3x4FX',
    company_role = 'Head of Sales APAC',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing Dext''s growth from the Sydney office!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Manager hires in Sydney, particularly with the fintech growth we''re seeing. Would love to share what we''re seeing in the market if helpful.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Cassandra Crothers') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADQ8dgBpVRcP-OvbKHXOHe7LwynZ4Z0sUI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recXlBKOiFHrLSuz1',
    company_role = 'Recruitment Team Lead - Asia Pacific',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Gartner Magic Quadrant recognition. Congrats on the strong showing!',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Executives in the data space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Executive hires in the data platform space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Belinda Glasson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAw0QZIBIA60RcTFRK19Yh350fbfSwD2pyM')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recXvOuzd0xPTUEVL',
    company_role = 'General Manager, Oceania',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $27.5M Series A news. Congrats on the funding!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams after major funding rounds.',
    linkedin_connected_message = 'I see you''re scaling the GTM team after the Series A. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the landscape, particularly around SDR hires in the construction tech space. With Sitemate doubling headcount, I imagine you''re seeing the challenges firsthand.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Sean Phelps') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA4KLGcBrsrSzy_0JizR97Rjzgvy1HgSjgA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recYGyqZR43A8WKgJ',
    company_role = 'Country Manager ANZ Regional Sales',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the KuppingerCole leadership recognition!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your enterprise sales team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise AE hires in identity and cybersecurity.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Eralp Kubilay') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAChthMBNtL0BJPUbfTHSi-ie9wRUHTDP-U')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recYHQb17gkuB0sIT',
    company_role = 'Sr Channel Sales Manager, APAC',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the Australian team expansion at WEKA!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the talent market across Australia? We''re noticing some interesting shifts in the market, particularly around SDR hires in the data platform space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jit Shen T.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABLVM1sBuS2_86jcEOluVckAbOeEWHwS1gU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recYfvBTpryqxpvvL',
    company_role = 'Executive General Manager, APAC',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Crypto.com partnership news. Love seeing Ingenico leading the way with crypto payments.',
    linkedin_follow_up_message = 'We''re working with some excellent Account Directors in payments at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the payments talent market? We''re noticing some interesting shifts in the landscape, particularly around Account Director hires in fintech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Celeste Kirby-Brown') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADiwXQBtDeYUuD-u_jadJSOuzE5tnvE7bY')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recYg9b3NpH3tjdGq',
    company_role = 'Vice President Sales, Asia Pacific & ME',
    employee_location = 'Singapore',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the COBOL Day Sydney event. Great to see Rocket investing locally!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates with enterprise software backgrounds at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.',
    linkedin_connected_message = 'I see you''re building out your Account Executive team. How are you finding the local talent market? We''re noticing some interesting shifts in the enterprise software space, particularly around AE hires with modernization experience in Sydney.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Praveen Kumar Chandrashekhar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACNvfsBOp-ItPhreLBIJjhX6b6M2Tqou-E')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recYmsyJwPhM5Qu3e',
    company_role = 'Head of Sales, Australia',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Birdeye Social launch. Love seeing the AI innovation you''re driving.',
    linkedin_follow_up_message = 'We''re working with some great SDR candidates at the moment. We helped HubSpot and Docusign with similar roles during their growth phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in AI and SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Louisa Jewitt') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACQbwOMBoWbnPVjgbxt-hRBlKmUIWLYAXcs')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recZC4LfGf840xm6C',
    company_role = 'Regional Vice President - Enterprise',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about the new partner program launch in APAC. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some strong partner sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their channel teams.',
    linkedin_connected_message = 'I see you''re building out the partner team. How are you finding the channel sales market in Australia? We''re noticing some interesting shifts in the talent landscape, particularly around Partner Sales Manager hires in SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Kimberley Duggan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABTVeoABlBO1Y3YxmZA24Q8GoowpRJlA9v8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recZi1Lvur1rcqgWw',
    company_role = 'Senior Channel Sales Manager',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Nueva partnership news. Love the Sydney expansion focus!',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AE candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during their expansion phases.',
    linkedin_connected_message = 'Hope you''re well Frankco! I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in the edge security space. With all the local expansion happening at Fastly, I imagine you''re seeing some unique opportunities. Would love to chat about what we''re seeing in the market.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Frankco Shum') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACtHbkBv-zQqzKwpDj6fpEuAPXVSSIwDdA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recZpi0f25tPPv5nH',
    company_role = 'Sales Team Leader APAC',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Fast Company Innovation Award news. Congrats on the recognition!',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Executives in the EOR space at the moment. Companies like HubSpot and Docusign have found our approach helpful during their expansion phases.',
    linkedin_connected_message = 'I see you''re building out your sales team in Australia. How are you finding the EOR market here? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Executive hires in HR tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Krina K.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAY-Vx8Bb5WtsXWOISxXGCfwKa6c_z9-dhs')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recZyUhykweSrhxnP',
    company_role = 'Sales Director ANZ',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about the new partner program launch in APAC. Love seeing the expansion into Australia.',
    linkedin_follow_up_message = 'We''re working with some great partner sales candidates at the moment. We helped HubSpot and Docusign build out their partner teams.',
    linkedin_connected_message = 'I see you''re building out the partner sales team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around partner sales hires in SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Nick Best') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAHYWMUBvblW_kEbEOPYgbcw69SPLXJYE_Q')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recaAtU4MxY5lPqB6',
    company_role = 'Regional Sales Manager',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the PartnerTrust Live event in Melbourne. Love the local investment!',
    linkedin_follow_up_message = 'We''re seeing some strong Enterprise AE talent in the market who have deep public sector experience. Companies like HubSpot and Docusign have found our approach helpful when scaling their government sales teams.',
    linkedin_connected_message = 'Hope you''re well Nick! I see you''re focused on the public sector space. How are you finding the market with all the new compliance requirements? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires who understand government procurement. That IRAP PROTECTED certification must be opening up some great opportunities.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Nick Lowther') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAwGVTwBO3SBJspgxl-5ys3aGXFSn8he8Cs')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recaVNbK03ht8wB1H',
    company_role = 'Sales Director',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the SNEC 2025 showcase and partnerships. Love seeing the APAC expansion.',
    linkedin_follow_up_message = 'We''re working with some excellent Senior Sales Managers in energy and cleantech at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team in Sydney. How are you finding the energy storage talent market? We''re noticing some interesting shifts in the landscape, particularly around Senior Sales Manager hires in cleantech and energy solutions.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('ZHIWEI JIANG') OR linkedin_url = 'https://www.linkedin.com/in/zhiwei-jiang-9678ab244')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recageLFsb0L5PXDP',
    company_role = 'Sales Director - Australia and New Zealand',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the SonarQube branding unification news. Smart move bringing everything under one brand.',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful for senior sales roles.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the enterprise sales market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in DevOps and security.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ben Pascoe') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABfRVUB4K3FRVVwlj1eQJgg2WTXX2EkLCg')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recazyXG9KNEG7d5Q',
    company_role = 'Senior Client Services Manager',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the AI-first strategy shift at 4mation. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent business development candidates who have AI/tech backgrounds at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.',
    linkedin_connected_message = 'Hope you''re well Lilli! I see you''re building out your team at 4mation. How are you finding the local talent market with the AI focus? We''re noticing some interesting shifts in the tech space, particularly around business development hires in Sydney. The demand for people who can sell AI solutions is really picking up.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Lilli Perkin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAgHrXoBL-Qr4418pjds6rhdTyu96JGNW7s')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recb2IKPsuNv6BxsY',
    company_role = 'Manager, Sales - Australia',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Fontworks acquisition news. Congrats on expanding into Japan!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in creative tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ellie G.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABO51BoBwZPu4oeeTWgTejUsaIMmwAOysc4')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recb5fr05C9GwY1m1',
    company_role = 'Director of Strategic Enterprise & Government ',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Protect Tour 2025 in Sydney. Great event!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.',
    linkedin_connected_message = 'Hope you''re well! I see you''re building out your BDR team. How are you finding the local talent market? We''re noticing some interesting shifts around sales development hiring in Sydney, particularly with the cybersecurity focus. Would love to chat about what we''re seeing.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Darren Ward') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAYOMIYBa-fPMsySKdf7d6NxPVZr5O-2i9g')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recb7PiXiU28QVGFm',
    company_role = 'Executive Search Recruiter',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw you''re with Niche 212. Love the work you''re doing in executive search.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Strategic Sales Manager candidates in Melbourne. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Strategic Sales Manager in Melbourne. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Sally Matheson') OR linkedin_url = 'https://www.linkedin.com/in/sally-matheson-0ba9b41')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recb7WOwJEWYvf8cB',
    company_role = 'Director of Sales Large Entreprise',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love Sprinklr''s international expansion focus. Exciting growth!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in enterprise SaaS. Would love to share what we''re seeing and hear your thoughts on the current state of things.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Gerry Tucker') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAcVxwBS4-YdSokPHeD0VxUL4frMzW-GCQ')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recb9z4p24spoAYF0',
    company_role = 'New Business Sales Director',
    employee_location = 'Greater Sydney Area',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Employee Compliance Module launch. Great local focus!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Manager hires in the HR tech space, particularly with companies scaling their CoreHR offerings in Sydney.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jeannine Winiata') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADjOGgBouLsUSM5EpH3OTeUacS34o7L47A')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recbG8xZw0zaD1CDp',
    company_role = 'VP Sales - APAC',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the capital raising initiative. Great move!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out their sales development teams.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the Sydney talent market? We''re noticing some interesting shifts around SDR hiring, particularly with companies scaling their go-to-market teams after funding rounds. The quality of candidates coming through has been really strong lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Mark Coughlan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAcWH-4BxLjUyIOP3IPE5m8rplvgZrWQJUU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recbO7wpxaiZGhb7x',
    company_role = 'Associate Manager, Sales Development APAC',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love what Vimeo''s doing in the video space. Hope you''re well Shane!',
    linkedin_follow_up_message = 'We''re working with some excellent senior sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC teams.',
    linkedin_connected_message = 'I see you''re covering the APAC region for Vimeo. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around senior sales hires in the video tech space. Always keen to connect with leaders like yourself who are building across the region.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Shane Ullman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAp97e4BXmJ0t8elSzfIHEmw7D7Q1yYLenY')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recbRmC5NLtPLM714',
    company_role = 'National Sales Manager',
    employee_location = 'Bonbeach, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the electric outdoor forklift launch. Great timing!',
    linkedin_follow_up_message = 'We''re working with some excellent sales professionals in the equipment sector at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their commercial teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around sales hires in the equipment space, particularly with companies focusing on sustainability initiatives like yours.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Scott Bocksette') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACiGdtwBPGmT_f_19CzXT_Jgtw4EtiW5g98')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recbay8x0sFgO75ia',
    company_role = 'Sales Manager',
    employee_location = 'Homebush, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Q2 results news. That 22% revenue growth is impressive!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Sales Ops candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring for a Sales Ops role at JD.COM. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('James Jeffson') OR linkedin_url = 'https://www.linkedin.com/in/james-jeffson-715774317')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recbcwXMuPfFhupxL',
    company_role = 'Director Of Operations',
    employee_location = 'Greater Melbourne Area, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Gartner Magic Quadrant news. Congrats on the Visionary recognition!',
    linkedin_follow_up_message = 'We''re working with some excellent Senior AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team in Australia. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Senior AE hires in the communications space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ash Gibbs') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABXU7gBFiOagMxMNU4okFLvMrKtTwYAjFU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recbiibX6zqm7G4Bc',
    company_role = 'Principal Project Manager (Director, Professional Services)',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Business Intelligence Platform of the Year award news. Congrats on the recognition!',
    linkedin_follow_up_message = 'We''re working with some experienced Key Account Managers in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful for similar roles.',
    linkedin_connected_message = 'I see you''re building out your Key Account Management team. How are you finding the fintech talent market? We''re noticing some interesting shifts in the landscape, particularly around senior account management hires in financial services.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Mamoon Huda') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADX1osBXQrG223XEaODsf8lLxxGAbqQebU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recboXR03VUOJD8An',
    company_role = 'Head of SMB and Channel',
    employee_location = 'Bendigo, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Series G funding news. $450M is incredible - congrats!',
    linkedin_follow_up_message = 'We''re working with some strong Sales Development Manager candidates at the moment.',
    linkedin_connected_message = 'I see you''re hiring a Sales Development Manager at Rippling. How''s the search going? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Andrew Rae') OR linkedin_url = 'https://www.linkedin.com/in/andyrae')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recbsysZbBHKUE3FU',
    company_role = 'Sales Manager - Jobs',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the AdFixus partnership news. Great move for digital advertising capabilities.',
    linkedin_follow_up_message = 'We''re working with some strong sales professionals in the marketplace space. We''ve helped HubSpot and Docusign with similar roles during growth phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the marketplace talent market? We''re noticing some interesting shifts, particularly around sales hires in classifieds and marketplace businesses.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Mzi Mpande') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACmHa5ABMaPCLNVVrHgGg5hh2nvvfFf7Fc0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recbu6mhnGMEe1774',
    company_role = 'Head of Growth, APAC',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the AI-first strategy announcement at Sage Future 2025. Exciting direction for APAC growth!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in the finance software space at the moment. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market for SDRs across APAC? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in finance software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Michael Small') OR linkedin_url = 'https://www.linkedin.com/in/smallmike')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recbzJiGjxMFIbqoR',
    company_role = 'Channel Sales Director',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the August platform updates. Love seeing the new Builder UI and Flow Builder improvements.',
    linkedin_follow_up_message = 'We''re working with some excellent Commercial AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Commercial AE hires in integration and automation.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Lahif Yalda') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAIQhfwBoW60ZiXYOgw9Zu1zd_-LFgwvqos')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recc4aVp6uEUW7QA7',
    company_role = 'Senior Sales Manager at Square',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the Square Handheld launch. That''s a game changer for sellers.',
    linkedin_follow_up_message = 'We''re working with some great onboarding specialists at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their seller enablement teams.',
    linkedin_connected_message = 'I see you''re building out your seller onboarding team. How are you finding the market? With all the new Square product launches, onboarding complexity must be growing. We''re seeing some interesting shifts in the talent landscape, particularly around onboarding specialist hires in fintech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Declan Keir-Saks') OR linkedin_url = 'https://www.linkedin.com/in/declankeirsaks')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recc4ha5ShE9mR21c',
    company_role = 'Director of Go To Market - SMB | Oceania',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $27.5M Series A news. That''s exciting growth!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases like yours.',
    linkedin_connected_message = 'I see you''re building out your GTM team. How are you finding the Sydney talent market? We''re noticing some interesting shifts around SDR hires, particularly with companies scaling as fast as Sitemate. The doubling of headcount must be keeping you busy on the hiring front.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Allie B.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAn2HIIBFWR7I08997kWFIpt9xGz6dWKb-M')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recc9Ou0EBKyldwUG',
    company_role = 'Country Manager AVP',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Tech Data partnership announcement. Great move for the ANZ market!',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their government sales teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the talent market for enterprise roles? We''re noticing some interesting shifts, particularly around Enterprise AE hires in the government sector. The Tech Data partnership should open up some great opportunities for growth.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jeremy Pell') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADJxGoBSH1Bf2LOXTCEWoFrCoqFPDuophg')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reccBCYYsNHwwSegp',
    company_role = 'Industrial IoT Sales Manager Australia',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the iF Design Award news for the WISE-IoT solution. Congrats on the win!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Key Account Manager candidates in the IoT space. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Key Account Manager at Advantech. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Damian Trubiano') OR linkedin_url = 'https://www.linkedin.com/in/damiantrubiano')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reccQGZbayt51GyiT',
    company_role = 'Vice President, Mastercard, Loyalty Sales Asia Pacific',
    employee_location = 'St Leonards, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the On-Demand Decisioning launch. Love seeing Mastercard''s innovation in the payments space.',
    linkedin_follow_up_message = 'We''re working with some excellent consulting sales leaders at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their consulting functions.',
    linkedin_connected_message = 'I see you''re building out your loyalty consulting team. How are you finding the market for senior consulting sales talent? We''re noticing some interesting shifts in the talent landscape, particularly around Director level hires in fintech and payments.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Mandy Gallie') OR linkedin_url = 'https://www.linkedin.com/in/mandy-gallie-3793871')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reccRG3MV4DHHrhG3',
    company_role = 'Senior Sales Manager',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the G2 award news. Congrats on being #1 IT Infrastructure Software!',
    linkedin_follow_up_message = 'We''re working with some strong Sales Managers with retail tech and international expansion experience. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re expanding internationally and ramping up sales investment. How are you finding the talent market for your European push? We''re noticing some interesting shifts in the retail tech space, particularly around Sales Manager hires with international experience.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Andrew Walford') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABkUAH0Bd4h_0bL9eGFTa8j0uyf26NVR-mM')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reccTaDY8ulymbfAI',
    company_role = 'Senior Outbound Business Representative',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'Low',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the BoxWorks AI launch news. Love seeing the new direction with Box Shield Pro and automation.',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in SaaS with the AI boom happening.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Yamato Toda') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACZ5KN8BNggEI6yaoJSRWnVltBMtz66X6Ww')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reccVJFihuNqN6JsP',
    company_role = 'Revenue Operations Specialist',
    employee_location = 'Brisbane City, Queensland, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the AI-powered LMS updates. Love the innovation focus!',
    linkedin_follow_up_message = 'We''re working with some excellent B2B sales candidates in Brisbane at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams in competitive markets.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around B2B sales hires in Brisbane, particularly with companies scaling their SaaS teams. The Launchpad community has been buzzing about the challenges and opportunities in the edtech space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Dajana Büchner') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAVOgdIBou3mUNl4O8dGx3jkDbK0yaBwF64')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recd5JmI82hfAdoTk',
    company_role = 'Vice President Commercial Sales APJ',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about Datadog''s expansion into India and the Middle East. Love seeing the AI observability focus.',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Engineers with AI and observability backgrounds. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.',
    linkedin_connected_message = 'I see you''re building out your Sales Engineering team. How are you finding the market for technical talent in the AI space? We''re noticing some interesting shifts, particularly around Sales Engineering hires in observability and AI platforms.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Adrian Towsey') OR linkedin_url = 'https://www.linkedin.com/in/adriantowsey')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recdHWFt5h9Lu5Wka',
    company_role = 'Sales Account Executive',
    employee_location = 'Brisbane, Queensland, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Emerson merger news. Congrats on the acquisition!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in industrial tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Thomas Godfrey') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAUSg8EBbwCVZnx3yT0i__4hEdkihB39VdQ')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recdO13f3i2pR82uY',
    company_role = 'GM (APAC) @ Cresta',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Melbourne office launch! Exciting expansion into APAC.',
    linkedin_follow_up_message = 'We''re working with some excellent strategic sales candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC teams.',
    linkedin_connected_message = 'Hope you''re settling in well to the new role! I see you''re building out the team in Melbourne. How are you finding the local talent market? We''re noticing some interesting shifts in the sales talent landscape, particularly around strategic sales director hires in the AI space. Would love to share what we''re seeing if it''s helpful.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Andrew Cannington') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABUKEEBsrsCK_RhU67OCn0UbFaOVbM1GJs')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recdTJKjBJwk9AFR6',
    company_role = 'Regional Sales Director - Asia',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the PartnerTrust Live event in Melbourne. Great partner focus!',
    linkedin_follow_up_message = 'We''re seeing some strong enterprise account managers with public sector experience in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out their government focused teams.',
    linkedin_connected_message = 'I see you''re focused on the public sector space. How are you finding the talent market in Sydney? We''re noticing some interesting shifts around enterprise sales hiring, particularly with the increased focus on government compliance and IRAP requirements. The demand for people who understand both the tech and regulatory side seems to be growing.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Charlie Wood') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABT_5uQBNnpxbPA4Xet_TUyTHylzO_gfRnQ')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recdX0R1jygaSc8Fj',
    company_role = 'Vice President of Sales APAC',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Series C news. Congrats on the €47.9M funding!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.
',
    linkedin_connected_message = 'I see you''re building out your Account Manager team in Sydney. How are you finding the enterprise sales talent market in APAC? We''re noticing some interesting shifts in the landscape, particularly around AM hires in SaaS and procurement tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Julien Fouter') OR linkedin_url = 'https://www.linkedin.com/in/julien-fouter-8631a1')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recdZJGS2OcWzGcsM',
    company_role = 'Director Solutions Sales',
    employee_location = 'Melbourne, Australia',
    stage = 'in queue',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw KPMG completed the digital transformation. That''s a massive achievement after 3 years.',
    linkedin_follow_up_message = 'We''re working with some strong Salesforce leaders in consulting. Happy to chat if useful.',
    linkedin_connected_message = 'I see KPMG is hiring a Salesforce Director. How''s the search going? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Dermot McCutcheon') OR linkedin_url = 'https://www.linkedin.com/in/dermotmccutcheon')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recdZJPXwj3CNVi1b',
    company_role = 'Senior Key Accounts Manager, South East Asia',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Ingram Micro partnership announcement. Great move for expanding reach.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Consulting Engineers in the Apple ecosystem. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring Consulting Engineers at Jamf. How are you finding the market? We work with companies like HubSpot on similar technical roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Pascal Budd') OR linkedin_url = 'https://www.linkedin.com/in/pascalbudd')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recdnmyN4W7en07cO',
    company_role = 'Country Manager, Australia and New Zealand',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Qlik Connect launch news. Love seeing the new AI tools - looks exciting.',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AE candidates in data and analytics at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the Enterprise AE market in data and analytics? We''re noticing some interesting shifts in the talent landscape, particularly around senior sales hires in the data space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Florence Douyere') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAxwV4BGnDPv0nScs9kRRTj9SJh1KhvquM')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recdwUoxasVJtKqG2',
    company_role = 'Regional Vice President, APJ',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Series F news. Congrats on the funding!',
    linkedin_follow_up_message = 'We''re working with some excellent Strategic AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the Strategic AE market in Australia? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise AI sales hires.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Will Hiebert') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKneMMBWXxgUwXv917SlLqPC20MZUbKi50')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recdylH6Zt9yA9zVZ',
    company_role = 'Retail Sales Manager',
    employee_location = 'Homebush, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the strong Q2 results news. Love seeing that 22% revenue growth!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Sales Ops candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring for a Sales Ops role at JD.COM. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Elizabeth Zab') OR linkedin_url = 'https://www.linkedin.com/in/elizabeth-zab-38ab2933b')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recdzqyOZ9J0eOzfX',
    company_role = 'Enterprise Account Executive, APAC',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney HQ launch news. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent sales candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases like yours.',
    linkedin_connected_message = 'I see you''re building out the sales team there. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around sales hires in Sydney. With Notion doubling the team size, I imagine you''re seeing plenty of opportunity but also some unique challenges in finding the right people.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Grant S.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAU5XzsBcGcPRlx6Aa3hly90N7GL0DmV68c')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'receI8vaZ90meP1dp',
    company_role = 'Regional Sales Director - Australia, New Zealand and Indonesia ',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the strategic partnerships with Riyadh Air and LIFT! That''s fantastic news.',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates across enterprise software if you''re looking externally.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Manager hires in enterprise software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ben Chandra') OR linkedin_url = 'https://www.linkedin.com/in/ben-chandra')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'receOnEBj8hfVrylp',
    company_role = 'APAC Senior Sales Director at Lucid',
    employee_location = 'Sydney, Australia',
    stage = 'connection_requested',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the airfocus acquisition news. Great move expanding the product suite!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Executives in APAC at the moment. Companies like HubSpot and Docusign have found our approach helpful during their expansion phases.',
    linkedin_connected_message = 'I see you''re building out your APAC team. How are you finding the market for Account Executives? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise AE hires in visual collaboration and SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('James Harkin') OR linkedin_url = 'https://www.linkedin.com/in/jamesbharkin')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'receR0hqVVTnpUNIf',
    company_role = 'Managing Director - APJ',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the iPX Sydney event news. That''s exciting growth!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Executive hires in Sydney, particularly with the partnership marketing space heating up.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Adam Furness, GAICD') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAGjvXwBK7N2PovSM8bhD4dgLzkrNer7-Nc')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'receYyczog7cgZ3Tq',
    company_role = 'Regional Executive - ANZ',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney data centre launch. Exciting local expansion!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out their local sales teams.',
    linkedin_connected_message = 'Hope you''re settling into the AE role well! How are you finding the local talent market with all the expansion happening? We''re seeing some interesting shifts around enterprise sales hiring in Melbourne, particularly with companies scaling their data sovereignty offerings.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ethan Ng') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADeS7cBS9x-vocWN56exG63lngBdgq5k8M')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recefL6OaIeILPSTk',
    company_role = 'Regional Director - Australia & New Zealand',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the WarpStream acquisition news. Great move for expanding the platform.',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AEs at the moment. Companies like HubSpot and Docusign have found our approach helpful for strategic sales roles.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the enterprise sales market? We''re noticing some interesting shifts in the talent landscape, particularly around strategic AE hires in data streaming and SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Simon Laskaj') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOY3NYBpBZX4hi7-PMLfbz16nJB8MhWQMo')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recequhWOVaRcPtuQ',
    company_role = 'Director, Sales Operations & Excellence – APAC',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the ESET Connect 2025 launch. Love the partner enablement focus!',
    linkedin_follow_up_message = 'We''re working with some excellent channel sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their partner teams.',
    linkedin_connected_message = 'Hope you''re well Carol! I see you''re building out your channel sales team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around channel sales hires in cybersecurity. With all the partner enablement work ESET is doing, I imagine finding the right people who understand both the technical side and partner relationships is crucial. Would love to chat about what we''re seeing in the market.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Carol Cao') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA3eC7oBNGIS54wsSTnXDchsIoyLaPnkTYE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'receqv65cNluFg5Uy',
    company_role = 'Australia/New Zealand Sales Leader',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing Atlassian hit $5.2B revenue. What a milestone!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some experienced partner sales candidates in the ANZ market. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Partner Sales Manager ANZ at Atlassian. How are you finding the market? We work with companies like HubSpot on similar partner roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Cat Rutledge Jones') OR linkedin_url = 'https://www.linkedin.com/in/catrutledge')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'receukE28AMV2hypI',
    company_role = 'VP Sales, APAC',
    employee_location = 'Canberra, Australian Capital Territory, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the COBOL Day Sydney event. Great to see local engagement!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Executive hires in Sydney. With all the expansion activity happening at Rocket, I imagine you''re seeing strong demand for quality AE talent.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('James O''Sullivan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAVQ7gMBejjqpaLiQyHMmK3zUKCB1Bu9KqU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recewHOO4mLBZQp6o',
    company_role = 'Regional Sales Director, APAC',
    employee_location = 'Sydney, Australia',
    stage = 'replied',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the ITEL acquisition news. That''s a smart move expanding into insurance tech!',
    linkedin_follow_up_message = 'We''re working with some excellent AEs in the insurance tech space at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the insurance tech market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in proptech and location intelligence.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Gregg McCallum') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAruFlEBUTKgHjUMxpI7cirQGFrHtyPO-qw')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recf7biGOGUvYfZQ3',
    company_role = 'VP Sales, APAC',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Fast Company Innovation Award news. Congrats on the recognition!',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Executives in the EOR space at the moment. Companies like HubSpot and Docusign have found our approach helpful during their expansion phases.',
    linkedin_connected_message = 'I see you''re building out your team in Australia. How are you finding the EOR sales market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Executive hires in HR tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Liying Lim') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABh21EB2dNZk_teWocn-L4NBnA7fdhqH5U')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recfAo1IMsMIYZ0AY',
    company_role = 'Regional Director - Enterprise & Public Sector JAPAC',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Security Today award news for History Player Search. Congrats on the win!',
    linkedin_follow_up_message = 'We''re working with some strong enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your enterprise team. How are you finding the security talent market in Sydney? We''re noticing some interesting shifts, particularly around enterprise sales hires with Verkada''s rapid growth to 25k customers.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Alexander Falkingham') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACmx5sBboJvtS49Fq096ZB3GBBueVWUGeo')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recfCv1I2GjfXj3hx',
    company_role = 'Director, Sales & Strategy',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the UNSW TRaCE partnership news. Love seeing the focus on clean energy tech.',
    linkedin_follow_up_message = 'We''re working with some excellent Business Development Managers in industrial tech at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the industrial automation market? We''re noticing some interesting shifts in the talent landscape, particularly around Business Development Manager hires in the automation space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Rocco De Villiers') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAYt9g4BB-n8arRZOg7MttjLi9-Lq1qtcuA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recfLQOwlNxz9dKKI',
    company_role = 'Senior Vice President APJ',
    employee_location = 'Melbourne, Australia',
    stage = 'in queue',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the IPO filing news. Exciting times ahead for Netskope!',
    linkedin_follow_up_message = 'We''re working with some experienced CSMs in the cybersecurity space. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring CSMs in Australia. How''s the expansion going? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Tony Burnside') OR linkedin_url = 'https://www.linkedin.com/in/tonyburnside')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recfMGTqJiR7As3AN',
    company_role = 'Business Development Team Lead',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the $55M Series A! Biggest in payments globally',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling into new markets.',
    linkedin_connected_message = 'Hope you''re settling in well at KPay! I see you''re building out the Sydney team as part of the Australia expansion. How are you finding the talent market here? We''re noticing some interesting shifts in the fintech space, particularly around BDR hires who understand the payments landscape.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Changjie Wang') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAEHLdzUByF5K99of1XX98Ic4t0XdbwkEfGY')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recfPEIwjUm0oRUn2',
    company_role = 'APAC GTM Lead',
    employee_location = 'Lake Wendouree, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the APAC expansion momentum. Great to see Remote leading the way!',
    linkedin_follow_up_message = 'We''re seeing some strong SDR talent in the market at the moment, especially candidates with remote selling experience. Companies like HubSpot and Docusign have found our approach helpful when building out their ANZ sales teams.',
    linkedin_connected_message = 'I see you''re building out your SDR team across ANZ. How are you finding the sales talent market across the region? We''re noticing some interesting shifts in the talent landscape, particularly around outbound SDR hires who can work effectively in remote environments. The demand for quality sales talent has definitely picked up with so many companies scaling their APAC operations.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Nick Martin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAL1axYBFxbel42gegrgSf9BNx9L7d6hVl8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recfSt6v2hRWBaA9V',
    company_role = 'Senior Regional Director ANZ',
    employee_location = 'Greater Brisbane Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney office expansion at Governor Phillip Tower. Great local growth!',
    linkedin_follow_up_message = 'We''re working with some excellent account management candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent market, particularly around account management hires in the research and advisory space. The Launchpad community has 300+ GTM leaders who''d love to connect, and through 4Twenty we''re seeing some strong candidates at the moment.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Tony Fulcher') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAMmzyUBvL6oCrJFnAl6TTR5-5PkZiaEq1w')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recfjUYvznZoGN7TM',
    company_role = 'Regional Vice President Customer Growth - APAC',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the iPX Sydney event news. 250+ attendees is impressive growth!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent space, particularly around Account Executive hires in partnership marketing. The growth from your iPX event shows you''re clearly onto something big.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Nick Randall') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABbxuOsBKNvMc6GvjwNSJK-fMvNuymkmFaM')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recfm7aRHC2MAYe6F',
    company_role = 'Vice President Sales ANZ',
    employee_location = 'Greater Brisbane Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new Brisbane head office launch. Looks incredible!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates in Brisbane at the moment. Companies like HubSpot and Docusign have found our approach helpful during these scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around BDR hires in Brisbane. The growth up there has been impressive to watch.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Danni Munro') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKJMo0BgADw8c0GB9w34TtJ2caDbEvshh8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recfr6lOOPmmiM3By',
    company_role = 'Assistant Sales Manager',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love what JustCo''s doing with the King Street and Pitt Street locations!',
    linkedin_follow_up_message = 'We''re working with some excellent sales candidates at the moment who have strong experience in workspace solutions. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around sales executive hires in the coworking space. The demand for experienced sales professionals who understand flexible workspace solutions has really picked up lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Elisabeth Lind') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAC3lW5IBcBW5Elo7yDZ0xCwMbEkpJ4Tk0XE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recfwpZ4CYV72gn6g',
    company_role = 'Client Consultant',
    employee_location = 'Rushcutters Bay, New South Wales, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Top Global Consumer Trends 2025 whitepaper. Great insights on the changing market landscape.',
    linkedin_follow_up_message = 'We''re working with some excellent Business Development candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Business Development hires in market research and data companies.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Sherryl M.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAALpfk0BkA3U5e0_7J5lpZ7VHA_z2K1d6TA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recfyQI93I5q3XhJf',
    company_role = 'Managing Director, APAC & Japan',
    employee_location = 'Singapore, Singapore',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the partnership news with Dixa. Love seeing ada''s AI-first approach to customer service.',
    linkedin_follow_up_message = 'We''re working with some great SDR candidates who get the AI space. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the market for SDR talent? We''re noticing some interesting shifts in the AI/customer service space, particularly around SDR hires who understand the technical side.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Tom Blackman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAANquXcBehZxpK5zPKdh9QC9jVHCPpvwELg')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recg2QyFYxj81bflc',
    company_role = 'Sales Director ANZ',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Diligent Connections event coming to Sydney. Exciting lineup!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates in the Sydney market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around BDR hiring in Sydney, particularly in the GRC space with all the AI developments happening.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Patrick Browne-Cooper') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAMI41ABmpup5_hJWikzXGzP3mKA-UHg8Fs')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recgDrrtXzx3TiHq2',
    company_role = 'Managing Director, Australia and New Zealand',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Stripe Capital launch news. Exciting move for local SMBs!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.',
    linkedin_connected_message = 'Hope you''re well Karl! I see you''re building out the Sydney team. How are you finding the local talent market? We''re noticing some interesting shifts around SDR hiring in Sydney, particularly with the fintech growth we''re seeing.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Karl Durrance') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACuXnIBXbSC6bh0Dep2jzwVgttBijAjH3k')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recgRPalW4IyjJE0w',
    company_role = 'Senior Vice President, Europe & Asia-Pacific',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney office expansion. Love the local growth!',
    linkedin_follow_up_message = 'We''re working with some excellent senior account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in competitive markets.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the talent market for senior account management roles? We''re noticing some interesting shifts in the market, particularly around experienced sales hires in the research and advisory space. The demand for quality account managers who can navigate complex IT decision makers is really heating up.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Byron Rudenno') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABJOhgBMxDrdpWxAv5izPepCIiU_Fs7K_8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recgX28HvuMYc5yTR',
    company_role = 'HEAD OF SALES – NEW ZEALAND & AUSTRALIA, SOUTHERN',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Fintech 2025+ report release. Great insights on cross-border payments trends.',
    linkedin_follow_up_message = 'We''re working with some strong SDR candidates in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the fintech talent market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in payments and fintech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Alex Gouramanis') OR linkedin_url = 'https://www.linkedin.com/in/alexgouramanis')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recgacB7bLBWjVBaL',
    company_role = 'Vice President and General Manager, Asia Pacific and Japan',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Frost Radar Leader recognition for MDR. Congrats on that achievement!',
    linkedin_follow_up_message = 'We''re working with some experienced Sales Managers in cybersecurity at the moment. We''ve helped companies like HubSpot and Docusign with similar roles.',
    linkedin_connected_message = 'I see you''re building out your ANZ sales team. How are you finding the cybersecurity talent market? We''re noticing some interesting shifts, particularly around Sales Manager hires in enterprise security.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Rob Dooley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABt-R8BUuDWf0oAmgRgwU5Lk-k0prtN7qI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recggP5zMVNdTeBht',
    company_role = 'Regional Director APAC',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw Huntress hit the 10 year milestone. Congrats on the anniversary!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in cybersecurity at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the cybersecurity talent market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in security tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Reece Appleton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAlXy-kBqk1aX_p0s-UMUsY7quPi-qHwpw8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recgm0zj33aB6URYn',
    company_role = 'Sales Director - ANZ',
    employee_location = 'Greater Sydney Area',
    stage = 'in queue',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the intelliHR rebrand to Humanforce HR. Smart move!',
    linkedin_follow_up_message = 'We''re working with some excellent Solutions Consultant candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their presales teams.',
    linkedin_connected_message = 'I see you''re building out your presales team. How are you finding the local talent market? We''re noticing some interesting shifts in the tech space, particularly around Solutions Consultant hires in Sydney. With all the growth happening at North Sydney HQ, I imagine you''re seeing strong demand for quality presales talent.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Zac Beeten') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAg5D5UBKwntZbqjUFJpOxGmaTBzjWI14SQ')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recgo7oV9FeErHNWS',
    company_role = 'Executive General Manager - Central Sales',
    employee_location = 'Canberra, Australian Capital Territory, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Blue Connections acquisition news. Congrats on the expansion!',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Executive candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the sales talent market with all the growth happening at Atturra? We''re noticing some interesting shifts in the landscape, particularly around Sales Executive hires in the tech services space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Alex Belperio') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAARXVWwBQ_wPN3EdVkeIIDqb_2kiRGZ3sLU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recgqASjS63A4ckfk',
    company_role = 'Regional Sales Manager - Enterprise & Government',
    employee_location = 'Brisbane, Queensland, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing 3Columns'' Growth Partner win. Strong Sydney momentum!',
    linkedin_follow_up_message = 'We''re working with some excellent public sector AEs at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their government teams.',
    linkedin_connected_message = 'I see you''re building out your public sector team. How are you finding the government talent market? We''re noticing some interesting shifts, particularly around Enterprise AE hires with security clearances in Sydney.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Evan Blennerhassett') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABkkiABOgltupySzqicCjIJE3SvQCiNmSc')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recgy0rIz6pMjaG3M',
    company_role = 'Sales Director - CX',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney Metro work. That''s huge infrastructure!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise sales candidates in the Sydney market at the moment. Companies like HubSpot and Docusign have found our approach helpful during their expansion phases.',
    linkedin_connected_message = 'I see you''re building out your APAC sales team. How are you finding the local talent market in Sydney? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales hires in construction tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Toni W.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACq66IkBHEcWBAzquJgCPhrrdQjOzg8M7-c')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rech9ZrQ1hsAYgOol',
    company_role = 'Solution Sales Director - Audit & Risk - APAC',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Diligent Connections event at the Australian Museum. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates who have GRC experience at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.',
    linkedin_connected_message = 'Hope you''re well Franco! I see you''re building out your team at Diligent. How are you finding the Sydney talent market with all the activity around the Connections event? We''re noticing some interesting shifts in the market, particularly around BDR hires in the GRC space. The AI focus at your event aligns with what we''re seeing candidates get excited about.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Franco Costa') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAPbIM0BOXJwaqZN9FoHwUTxsW8nukA6xyM')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rechFJHyFnZLatbwH',
    company_role = 'Managing Director',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw Sentrient''s focus on 2025 compliance changes. Smart positioning!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in the compliance space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Melbourne teams.',
    linkedin_connected_message = 'I see you''re building out your AE team. How are you finding the local talent market? We''re noticing some interesting shifts in the market, particularly around Account Executive hires in compliance and GRC software. With Sentrient''s growth to 600+ businesses, timing seems perfect for scaling the sales team.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Gavin Altus') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAH2Ks8B9CVgTV3otuMOf6tzXgPFX73ZSj0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rechKl6GBWUmp8BPM',
    company_role = 'Sales Manager',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the iPX Sydney event news. That''s exciting growth in the local market!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts around Account Executive hires in the partnership space, particularly with companies scaling locally like Impact.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Peter Gregson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAmxmKQBXgzHQV-kkVFIlKBlgALPkShT2w4')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rechYvSzvc3ycpmjT',
    company_role = 'National Sales Director',
    employee_location = 'Melbourne, Australia',
    stage = 'connection_requested',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Zeenea acquisition news. Smart move to strengthen the data analytics side.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Sales Director candidates in enterprise software. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Sales Director at HCLSoftware. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Gautam Ahuja') OR linkedin_url = 'https://www.linkedin.com/in/gautam-ahuja-226279292')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rechfkxIWm8kccy2q',
    company_role = 'GM of ANZ, SEA and India',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney HQ launch! Love the local expansion.',
    linkedin_follow_up_message = 'We''re working with some excellent sales talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases like yours.',
    linkedin_connected_message = 'I see you''re scaling the team there. How are you finding the local talent market? We''re noticing some interesting shifts, particularly around sales hires in Sydney. With plans to double headcount, I imagine you''re seeing the competition firsthand.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Andrew McCarthy') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAP2OIEBhvmsGs4CE-6xJ22XbVoQB91JuM8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recht35SReFcRf3bv',
    company_role = 'Product Enablement Lead',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the AI-powered Conversational Search launch. Love seeing the innovation at Squiz!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong product marketing and enablement candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Senior Product Marketing and Sales Enablement Manager at Squiz. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Prakash Damoo') OR linkedin_url = 'https://www.linkedin.com/in/prakashdamoo')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reciBwHcefXFR8rE6',
    company_role = 'Regional Director, ANZ',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Google acquisition news. That''s incredible!',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during major growth phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the enterprise sales market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in cybersecurity.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Budd Ilic') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABjY0oBt7rwWfdC54shwh0MlU23V7AeGCQ')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reciE84GTYcHNiV9O',
    company_role = 'Professional Services Manager - Australia',
    employee_location = 'Greater Melbourne Area, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the TrustRadius awards news. Congrats on the eight wins!',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Executive candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Executive hires in software solutions.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Vicki Sayer') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABcJOxwBpkwe7JfLjG8x4qlzvC9VvA_w_Wc')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recikzeGhhzDbcBuy',
    company_role = 'Head of Enterprise Solutions Sales - APAC & Japan',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw Atlassian hit $5.2B revenue. Incredible growth in enterprise!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong partner sales candidates in the APAC region. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Partner Sales Manager ANZ at Atlassian. How are you finding the market? We work with companies like HubSpot on similar partner roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Martin Yan') OR linkedin_url = 'https://www.linkedin.com/in/martinyan')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recim2nSBvZIkuQLf',
    company_role = 'Senior Sales Manager',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw Ordermentum hit $2 billion in transactions. That''s massive! Congrats on the milestone.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Sales Enablement candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see Ordermentum is hiring a Sales Enablement Manager. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Shaun Haque') OR linkedin_url = 'https://www.linkedin.com/in/shaunhaque')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recin5eSOv7uqcyOG',
    company_role = 'Sales Director APAC',
    employee_location = 'Brisbane, Queensland, Australia',
    stage = 'connection_requested',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the AI Product of the Year award news. Congrats on the win!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid growth phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the automotive tech market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in AI companies.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Vanessa Cause') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAswnPEB6abP0DKP2dVhBTtQw6p64qbLQjw')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recivA3sbUbbu8tON',
    company_role = 'Sales Director, ANZ',
    employee_location = 'Sydney, Australia',
    stage = 'in queue',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Google acquisition news. That''s huge - congrats on the $32B deal!',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AEs in cybersecurity at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the cybersecurity talent market? We''re noticing some interesting shifts in the landscape, particularly around Enterprise AE hires in cloud security.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Sam Symmans') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABtC2LYBxzEo8yr9HI-CVjcGL41YR5apCsU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recixkHAC8cvSQXy0',
    company_role = 'Regional Sales Manager - Western Australia',
    employee_location = 'Perth, Western Australia, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Great Place to Work recognition. Well deserved!',
    linkedin_follow_up_message = 'We''re working with some excellent strategic account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the talent market around senior sales roles? We''re noticing some interesting shifts in the market, particularly around strategic account manager hires in the tech space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Clint Elliott') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATjWbIBcqRSeBGi4CTrVeLVt0wg7PSg0BI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reciy2Kv84AHdmjZa',
    company_role = 'Head of Sales, Australia',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the March Work Innovation Summit. Love the local focus!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.',
    linkedin_connected_message = 'I see Asana''s continuing to build out the Sydney team. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around BDR hires in the collaboration space. The summit looked like a great way to connect with local leaders.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ryan Alexander') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFOtaMBTxx1xHv5t0vDvnKSDMC-V84fqGw')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recizcGBMuqNpULyj',
    company_role = 'Pacific Sales Director - CostX',
    employee_location = 'Brisbane, Queensland, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney Metro and WestConnex wins. Impressive local growth!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise sales candidates in the construction tech space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC sales operations.',
    linkedin_connected_message = 'I see you''re building out your APAC sales team. How are you finding the market for senior sales talent across the region? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales hires in construction tech. The demand for digitisation expertise seems to be driving some unique hiring challenges.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Penny Dolton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABQhvCMBfPI1DZKch-OWcdQdizG_PhnAfiY')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recj74ToRqf8ByLuI',
    company_role = 'Director - APAC Sales',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the G2 award news. Congrats on being #1 IT Infrastructure Software!',
    linkedin_follow_up_message = 'We''re working with some experienced Sales Managers at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the market with all the international expansion happening? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Manager hires in SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Marco D. Castelán') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAlYnbYBeNCdo3-hfYch3V1Lm2GAfBy9NYE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recjGNatiZBvN0Rpj',
    company_role = 'Senior Sales Director - APAC',
    employee_location = 'Greater Brisbane Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love that Info-Tech''s Sydney office is the APAC hub. Smart positioning!',
    linkedin_follow_up_message = 'We''re working with some excellent account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when expanding their regional teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the talent market across the region? We''re noticing some interesting shifts around account management hires in APAC, particularly with companies scaling their advisory services.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Julian Lock') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEwvkQBLlxtnjb21fPWmyLZs0tTGTTsEEc')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recjIsZ0dg1FWmaI2',
    company_role = 'Sales Director, ANZ',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $152M funding news. Congrats on the round!',
    linkedin_follow_up_message = 'We''re working with some strong Enterprise Sales candidates in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the fintech talent market? We''re noticing some interesting shifts, particularly around Enterprise Sales hires in treasury management.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Matthew Tyrrell') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACxYdABEDFKVJ_3G6aUhQ9mdwGC1N1lLHM')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recjOkzIweR9qaiII',
    company_role = 'National Sales Manager',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the Great Place to Work recognition! Well deserved.',
    linkedin_follow_up_message = 'We''re working with some excellent strategic account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise sales teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the Sydney market for strategic account roles? We''re noticing some interesting shifts in the talent landscape, particularly around senior sales hires in IT services. The demand for experienced account managers who can navigate complex enterprise deals has really picked up.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Luke Kavanagh') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABvENSEBSnBFLbw3LUBx-G1Xlp1u6Ewlfes')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recjY4KLAMMr8HGFS',
    company_role = 'Head of Partnerships',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the AU/NZ Shopify app launch. Great move for the local market!',
    linkedin_follow_up_message = 'We''re working with some excellent Customer Success candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their CS teams.',
    linkedin_connected_message = 'I see you''re building out your customer success team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Customer Success Manager hires in logistics tech. The demand for people who understand both the technical side and client relationship management has really picked up since more companies are focusing on retention and expansion.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jackson Duffy') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAB-U4eEBYicTIC6uh0BFjw4pgqgZUHZ6esI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recjZD38O6vAaz5Y2',
    company_role = 'Adyen Country Manager - Australia & New Zealand',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Reece partnership news. That''s a huge win for the ANZ market!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases like yours with the Reece rollout.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market after the Reece partnership? We''re noticing some interesting shifts in the market, particularly around Account Manager hires in payments. With 600 stores rolling out, I imagine you''re scaling fast. Would love to chat about what we''re seeing in the market.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Hayley Fisher') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAChh5IB6b2s_eEXnNb3VomBlbDxgWQ6k30')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recjZfpd7n63Bgw0I',
    company_role = 'Sales Operations Manager',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Silverwater operation. Love the Sydney distribution focus!',
    linkedin_follow_up_message = 'We''re working with some excellent strategic account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.',
    linkedin_connected_message = 'I see you''re building out your team with the National Strategic Account Manager role. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the market, particularly around strategic account hires in IT distribution.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Amanda Kidd') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOTOs0B1__1QRYZTg9OvtyYx82Oshtxbh0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recjpf1oZQVPxOotT',
    company_role = 'General Manager',
    employee_location = 'Greensborough, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Great to connect Alexander! Love seeing the growth at E1 across the APAC region.',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates across enterprise software.',
    linkedin_connected_message = 'I see you''re building out your team for E1. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in enterprise software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Alexander G.') OR linkedin_url = 'https://www.linkedin.com/in/alexanderjgreen')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recjvnDJ55oJcRFvR',
    company_role = 'National Sales Manager',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the Silverwater operations hub. Great Sydney presence!',
    linkedin_follow_up_message = 'We''re working with some excellent strategic account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise sales teams.',
    linkedin_connected_message = 'I see you''re building out your strategic accounts team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent landscape, particularly around strategic account manager hires in the IT services space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Luke Kavanagh') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABvENSEBSnBFLbw3LUBx-G1Xlp1u6Ewlfes')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recjyWvxnGmGGTDu0',
    company_role = 'Growth & Operations',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Great to connect Simon! Love seeing growth and operations leaders driving strategic initiatives forward.',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Director candidates across enterprise software.',
    linkedin_connected_message = 'I see you''re building out your team for Think & Grow. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in enterprise software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Simon Robinson') OR linkedin_url = 'https://www.linkedin.com/in/simonrobinson1974')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reck36OfCvKCGKHpo',
    company_role = 'Sales Manager',
    employee_location = 'Greater Perth Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about Christopher Smith joining as APAC MD. Exciting times ahead for Civica!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates with local government experience. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market for local government AEs? We''re noticing some interesting shifts in the talent landscape, particularly around public sector sales hires with the APAC expansion happening.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Danielle Langley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFTm9QBAEDhSFTBVl7GdgQvLFHmRqlx508')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reckJX8bzwIfnfj1U',
    company_role = 'Senior Sales Manager Australia, JustCo',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the enterprise push across your Sydney locations. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent sales candidates in the coworking space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the local talent market? We''re noticing some interesting shifts around sales hires in the flexible workspace space, particularly with companies scaling their enterprise solutions in Sydney.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Damian Wrigley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAALBzWoBh0bvRZ3l3aNQ-nM5VdzBqiEMYeA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reckMAhhcEYfHkClb',
    company_role = 'Enterprise Account Executive, APAC',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the Sydney HQ launch. Great local momentum!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases like yours.',
    linkedin_connected_message = 'I see you''re building out the APAC sales team. How are you finding the local talent market with plans to double headcount? We''re noticing some interesting shifts in the market, particularly around enterprise sales hires in productivity software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ashley Carron-Arthur') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAW0bdgB9kKGArhyUcp9phFh9UEKcmZLPKE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recktK08M6soM75dN',
    company_role = 'Director of Sales - Workday Practice',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Q2 results news. Congrats on the strong performance!',
    linkedin_follow_up_message = 'We''re working with some strong candidates in the TMT consulting space.',
    linkedin_connected_message = 'I see you''re hiring for the TMT Service Line Specialist role at Cognizant. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Allison Watts') OR linkedin_url = 'https://www.linkedin.com/in/allisonwatts')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reckud9kvrccGNCU1',
    company_role = 'Head of Customer Success',
    employee_location = 'Gold Coast, Australia',
    stage = 'lead_lost',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new cloud platform launch. Love seeing the multi-tenant approach for enterprise customers.',
    linkedin_follow_up_message = 'We''re working with some experienced Sales Managers in cybersecurity at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re hiring a Regional Sales Manager in Canberra. How are you finding the cybersecurity talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Manager hires in enterprise security.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Renee Rooney') OR linkedin_url = 'https://www.linkedin.com/in/renee-rooney-67b779115')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recl8hsdy1FFKNLsW',
    company_role = 'Vice President Aerospace & Defence APJMEA',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing IFS winning Rolls-Royce Power Systems. Great work in aerospace!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong presales candidates in the AI space. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Presales Consultant for AI Growth at IFS. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Anthony Read') OR linkedin_url = 'https://www.linkedin.com/in/anthony-read-a2a244133')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reclCcLVWujz8SLOW',
    company_role = 'Ecosystem Sales Director - Hybrid Integration and iPaaS for Australia & NZ market',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing IBM''s focus on expanding the channel partner network. Great timing with all the AI growth.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong sales specialists in the automation space at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Brand Sales Specialist for the automation platform. How''s the search going? We work with companies like Hubspot on similar sales roles across ANZ.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Srikanth Mohan') OR linkedin_url = 'https://www.linkedin.com/in/srikanth-mohan-0bb5318')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reclI9ZXrkMVksTPl',
    company_role = 'Sales Director - APAC',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Broadcom partnership news. Great move for Canonical!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong partner sales candidates in the ANZ region. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Partner Sales Executive for ANZ. How are you finding the market? We work with companies like HubSpot on similar partner sales roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Geoffrey Andrews') OR linkedin_url = 'https://www.linkedin.com/in/geoffreyandrews')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reclJiss1NlzW0wP9',
    company_role = 'General Manager AU/NZ',
    employee_location = 'Greater Brisbane Area',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the AI Product of the Year award news. Congrats!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in automotive tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Michael Clarke') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAANeKMIBAghOM7EsWC2KHNpJuac7-LEj4iU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reclKJn3g48XcTaXA',
    company_role = 'Chief Delivery Officer',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the platform upgrades and doubled partner network at Squiz. Great year for growth!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong product marketing and enablement candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Product Marketing and Sales Enablement Manager at Squiz. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Elizabeth Watson') OR linkedin_url = 'https://www.linkedin.com/in/elizabeth-watson-0817163')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reclMU0UyT2JMuEtc',
    company_role = 'SDR Manager | Simplifying IT Management | NinjaOne',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Forbes Cloud 100 news. Congrats on the recognition!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your SDR team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in IT management and SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Lawrence Du') OR linkedin_url = 'https://www.linkedin.com/in/lawrencedu')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recleGE0Fu1oEFrVU',
    company_role = 'Head of Sales, ANZ',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on hitting $250M ARR from Sydney HQ!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during these rapid growth phases.',
    linkedin_connected_message = 'I see you''re building out your team with all the new roles being posted. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around sales development hires in Sydney. The growth you''re seeing must be creating some exciting opportunities but also some real challenges in finding the right people quickly.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Laura Lane') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA60TEUBtHEGo8MSRgRlqw4GER1hdQ6GDio')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reclfLlKEtVaxh7DO',
    company_role = 'Senior Sales Manager',
    employee_location = 'Queenscliff, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the Anthropic investment news. That''s a massive move for Amazon!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong Account Manager candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring Account Managers at Amazon. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Rayna K. McNamara') OR linkedin_url = 'https://www.linkedin.com/in/rkmcnamara')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reclgKGTLBH63pZx2',
    company_role = 'Regional Vice President of Sales',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing SUGCON ANZ 2025 coming to Sydney!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates focused on new business development at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their ANZ teams.',
    linkedin_connected_message = 'I see you''re building out your SDR team for ANZ new business. How are you finding the talent market across the region? We''re noticing some interesting shifts around SDR hiring in the tech space, particularly with companies expanding their ANZ presence.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Johanes Iskandar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFsm_MB8ey7pT_xGIqT5m13Pmp-bQAxuz0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recljpxKJLmaLtkQq',
    company_role = 'Enterprise Sales Manager',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the Sydney CBD growth across King Street and Pitt Street locations!',
    linkedin_follow_up_message = 'We''re working with some excellent sales executive candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in competitive markets.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent space, particularly around sales executive hires in the coworking sector. With JustCo''s expansion across multiple CBD locations, I imagine you''re seeing strong demand for experienced sales professionals who understand flexible workspace solutions.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Charlotte Buxton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAtZsYgBHap28_PCkeYpoWUf5Cn2X9W7PlE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reclmPIOukbHtwkf5',
    company_role = 'Executive Director – Education (APAC)',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about Christopher Smith joining as APAC MD. Great move for the expansion.',
    linkedin_follow_up_message = 'We''re working with some excellent local government AEs at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local government market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in the public sector.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Steve Smith') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAE2xnwBHqukdddvJW7wTNR9yihRbJft-1o')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reclnuDGNYZXqPLQj',
    company_role = 'Manager Client Success APAC',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Fosway 9-Grid recognition. Congrats on the Core Leader status!',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise Sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your Enterprise Sales team. How are you finding the learning tech market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Avinash Kalyana Sundaram') OR linkedin_url = 'https://www.linkedin.com/in/avinashkalyanasundaram')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reclsqkVNYVsbdAEJ',
    company_role = 'GM US & ANZ',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Shadow AI Report. Great insights on Sydney tech risks!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in the security space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams during growth phases.',
    linkedin_connected_message = 'I see you''re building out your AE team. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around enterprise sales hires in the cybersecurity space. The timing with your Shadow AI Report really highlights how much demand there is for security expertise right now.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Nathan Archie') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACt8skBOZUBu0dTQWpNwll9YGGfCJAxFQk')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reclvFVCbtiLEgbBN',
    company_role = 'Senior Business Development Manager',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the Victorian client wins. NDIS space is moving fast!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates with care sector experience at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.',
    linkedin_connected_message = 'I see you''re building out your BDR team. How are you finding the market for sales talent in the care management space? We''re noticing some interesting shifts in the talent landscape, particularly around BDR hires who understand the NDIS and aged care sectors. The regulatory knowledge piece seems to be becoming more important.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Francis McGahan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAmGghgBAi-x_YW7TBfbqQdhQXlDL-uqnuk')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recm8YD3tBWLgsTdU',
    company_role = 'Sales Director - Pacific',
    employee_location = 'Australia',
    stage = 'connection_requested',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Emerson merger news. That''s exciting for AspenTech!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates with industrial software experience. Companies like HubSpot and Docusign have found our approach helpful during growth phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the industrial tech talent market? We''re noticing some interesting shifts in the talent landscape, particularly around AE hires in Melbourne''s tech sector.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Whitney Liu') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKWOWsBCR8GNYEhWDEIIoBWXoh-dIEWvq8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recmF5nGQLfdG4RXc',
    company_role = 'Head of Sales',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the AU/NZ Shopify app launch. That''s exciting timing with the growth!',
    linkedin_follow_up_message = 'We''re working with some excellent Customer Success candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your Customer Success team. How are you finding the talent market in Sydney? We''re noticing some interesting shifts around CS hires in logistics tech, particularly with companies scaling their e-commerce integrations.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Anthony Harding') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAALJM9EBwayAkUKsPSNP0Vf8S-g5a8kJ-Jo')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recmGayu5dUZYTmVe',
    company_role = 'Head of Sales',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Reece partnership news. That''s a massive win for the ANZ market!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during these scaling phases.',
    linkedin_connected_message = 'Hope you''re well! I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Manager hires in payments, particularly with all the growth happening in the sector right now.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Lara Horne') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADPv2MBIHAKcCXc3fSFN9Yck-NJ6fpMVfc')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recmQzEqDP3gZhtZj',
    company_role = 'Director Sales Engineering',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the ANZ data readiness report. Great insights on cyber resilience!',
    linkedin_follow_up_message = 'We''re working with some excellent Strategic AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market across the region? We''re noticing some interesting shifts in the talent market, particularly around Strategic AE hires in data security. The demand for enterprise sales professionals who understand cyber resilience has really picked up since that report came out.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Paul Lancaster') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAGWWpABv7fX58S-LxILR12NxW5aH1_mBcQ')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recn9wAQ9K8bZ6WSm',
    company_role = 'Head of APAC',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the CloudTech partnership news. Love the Melbourne momentum!',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Director candidates in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams locally.',
    linkedin_connected_message = 'I see you''re building out your sales team in Victoria. How are you finding the local talent market? We''re noticing some interesting shifts around senior sales hires in fintech, particularly with all the digital asset expansion happening in Melbourne.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Amy Zhang') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAYrHPsBGdLU3yWdbqidfTNveRScmdDx6YY')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recnPnJONpifitt13',
    company_role = 'Sales Director ANZ',
    employee_location = 'Sydney, Australia',
    stage = 'connection_requested',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the five HotelTechAwards wins! That''s fantastic recognition for the team.',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Director candidates across SaaS if you''re looking externally.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Kristin Carville') OR linkedin_url = 'https://www.linkedin.com/in/kristin-carville-75b67439')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recnVGTKtSM0aiZiI',
    company_role = 'Head of Sales- ANZ',
    employee_location = 'Melbourne, Australia',
    stage = 'connection_requested',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Agentforce partnership news. Love seeing Simplus leading the AI transformation space.',
    linkedin_follow_up_message = 'We''re working with some strong Presales candidates in the Salesforce space. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Presales Executive at Simplus. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Carlos Bravo') OR linkedin_url = 'https://www.linkedin.com/in/1carlosbravo')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recngLCkjBMrNRpUN',
    company_role = 'Merchant Success Manager',
    employee_location = 'Ballina, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $200M funding news. Congrats on hitting unicorn status!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around BDR hires in logistics and fulfillment.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Stephanie May') OR linkedin_url = 'https://www.linkedin.com/in/stephaniejmay')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recnhGB1PcBzGZVOc',
    company_role = 'Regional Vice President - Australia & NZ',
    employee_location = 'Sydney, Australia',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the platform upgrade news. Love the AI features you''ve added.',
    linkedin_follow_up_message = 'We''re working with some strong Senior Enterprise AEs at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your enterprise team. How are you finding the market for Senior AEs? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales hires in the analytics space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Adam Maine') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAJwrrABLmGhjluE_TVDochkNzu69dgCrRw')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recnjSBDdcSUaeRFY',
    company_role = 'Regional Director - ASEAN & India',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the Melbourne office expansion. Great local growth!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful during local expansion phases.',
    linkedin_connected_message = 'I see you''re building out the team locally. How are you finding the Melbourne talent market? We''re noticing some interesting shifts around mid-market AE hires, particularly in the privacy and compliance space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Arran Mulvaney') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA1tgBYBgCPCkhWuHwV7M6hQa9nArWkksa0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recns3yCbnYa9osEQ',
    company_role = 'Vice President - Australia & New Zealand',
    employee_location = 'Greater Melbourne Area, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Security Today award news for History Player Search. Congrats on the win!',
    linkedin_follow_up_message = 'We''re working with some strong Enterprise Development Reps in security at the moment. We''ve helped HubSpot and Docusign with similar enterprise sales roles.',
    linkedin_connected_message = 'I see you''re building out your enterprise team. How are you finding the security talent market in Sydney? We''re noticing some interesting shifts in the landscape, particularly around Enterprise Development Rep hires in the security space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Steve Bray') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAHP9jQB2bkW1oHFixi1wXIgO1dESQBnKms')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reco0fBm5GNOyl9RS',
    company_role = 'Australia Sales Manager – Hotels, Resorts & Apartments',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the rebrand news for RMS. Love the new direction focusing on connection.',
    linkedin_follow_up_message = 'We''re working with some strong SDR candidates in hospitality tech at the moment. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the hospitality tech market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in the sector.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jacob Sinnott') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABysF_MBgBu8JsLc3Ia1iH68N_H_9z-Ed1k')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recoHC30aDPoyfOGk',
    company_role = 'Senior Sales Account Manager',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the strategic partnerships with Riyadh Air and LIFT! That''s fantastic news.',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates across enterprise software if you''re looking externally.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Manager hires in enterprise software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Leanne Mackenzie') OR linkedin_url = 'https://www.linkedin.com/in/leanne-mackenzie-396b66a8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recoO2NpaxZnI2m5W',
    company_role = 'Strategic Sales Leader - Intelligent Operations',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Turbonomic advancements news. Love seeing IBM''s continued innovation in intelligent operations.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong sales specialists in the automation and AI space. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Brand Sales Specialist for the automation platform. How''s the search going? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Winnie Nguyen') OR linkedin_url = 'https://www.linkedin.com/in/winnie-nguyen-94144a67')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recoT51ICsiKcDOOf',
    company_role = 'VP of Enterprise Sales (Platforms & Embedded Financial Services Specialist)',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Reece partnership news. That''s a huge win for the ANZ market!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates with strong fintech backgrounds at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their commercial teams in this market.',
    linkedin_connected_message = 'Hope you''re well Kane! I see you''re scaling the account management team. How are you finding the local talent market? We''re noticing some interesting shifts in the fintech space, particularly around Account Manager hires with payments experience. The Reece partnership must be creating some exciting opportunities for the team.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Kane Lu') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABpBNk0BymOf_bbIhKMxdDCG-wDwOtjW53s')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recoZZjiXX12YFvMG',
    company_role = 'Head of Business Development',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the electric forklift expansion. Smart move for the Melbourne market!',
    linkedin_follow_up_message = 'We''re working with some excellent sales professionals in the equipment space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their commercial teams.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the local talent market in Melbourne? We''re noticing some interesting shifts around sales hires in the equipment sector, particularly with companies expanding their sustainable product lines.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Vince Tassone') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOWyFABjBlXNALdg2cx1BFlorP1hzGGTF8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recofUWreVDayokvJ',
    company_role = 'Sales Manager SA NT TAS',
    employee_location = 'Greater Adelaide Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the ATS acquisition news. Great move strengthening the Melbourne presence!',
    linkedin_follow_up_message = 'We''re working with some excellent sales candidates in the industrial sector at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling through acquisitions.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market post acquisition? We''re noticing some interesting shifts in the market, particularly around sales hires in industrial tools. The ATS integration must be creating some exciting opportunities for growth in Melbourne.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Matt Ditchburn') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACiNhCgBUVgvskJNb2AjsfmQ8hmD6eGxjHE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recooaC5cwS70mgCc',
    company_role = 'National Sales Manager',
    employee_location = 'Greater Adelaide Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the ATS acquisition news. Smart move expanding in Melbourne!',
    linkedin_follow_up_message = 'We''re working with some excellent sales professionals in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases.',
    linkedin_connected_message = 'Hope you''re settling in well with the ATS integration. How are you finding the local talent market? We''re seeing some interesting shifts around sales hiring in Melbourne, particularly with companies scaling after acquisitions.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Christian Whamond') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOyA5gBXWMt2uBwBhbre-Jy83RaJ5cyjmk')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recp4h7R2QaNFV39c',
    company_role = 'Executive Chairman',
    employee_location = 'Malvern, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the UNICEPTA integration and expanding Prophet''s global media intelligence capabilities! That''s fantastic news.',
    linkedin_follow_up_message = 'We''re working with some excellent partnerships candidates across enterprise software if you''re looking externally.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around partnerships hires in enterprise software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Sean Taylor') OR linkedin_url = 'https://www.linkedin.com/in/sean-taylor-2b19711')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recpQORT0bn6BHDSF',
    company_role = 'Head of Enterprise ANZ',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing monday.com''s focus on enterprise customers. Must be an exciting time in ANZ.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong SDR Manager candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring an SDR Manager at monday.com. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jeremy Auerbach') OR linkedin_url = 'https://www.linkedin.com/in/jeremyauerbach')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recpYFIBqCTtMDBKg',
    company_role = 'Regional Sales Manager - Western Australia',
    employee_location = 'Perth, Western Australia, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the specialist business focus since the restructure. Smart move!',
    linkedin_follow_up_message = 'We''re working with some excellent account management talent in the tech space. Companies like HubSpot and Docusign have found our approach helpful when building out their strategic sales teams.',
    linkedin_connected_message = 'Hope you''re settling in well at Madison Group. How are you finding the IT services market at the moment? We''re seeing some interesting shifts in the talent space, particularly around strategic account management roles in tech distribution.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Clint Elliott') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATjWbIBcqRSeBGi4CTrVeLVt0wg7PSg0BI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recpdnRqd7CgIjRN3',
    company_role = 'Head of Digital Natives, Australia and New Zealand',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Stripe Tour Sydney event. Love the local expansion!',
    linkedin_follow_up_message = 'We''re seeing some strong SDR talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney teams.',
    linkedin_connected_message = 'I see you''re in the SDR space at Stripe. How are you finding the local talent market? We''re noticing some interesting shifts around sales development hiring in Sydney, especially with all the fintech growth happening.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Amy Zobec') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAARq-roBv5Cu8VrZrnUoSezl3CtMDyGzyRk')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recpecgItU0gi5QVa',
    company_role = 'Head of Enterprise Sales',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the GBG Go platform launch. That''s exciting timing for APAC growth!',
    linkedin_follow_up_message = 'We''re working with some excellent senior account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when expanding their regional teams.',
    linkedin_connected_message = 'I see you''re building out your ANZ team. How are you finding the talent market across the region? We''re noticing some interesting shifts around senior account management hires in identity verification, particularly with companies scaling their APAC operations like GBG.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Darin Milner') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABvC-ABwpKIVxU1YBQMnGaqzsufzXumsyE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recphu2dn4kctBcC0',
    company_role = 'Enterprise Corporate Sales Manager II',
    employee_location = 'Pakenham South, Victoria, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Melbourne office expansion. Great move for the ANZ market!',
    linkedin_follow_up_message = 'We''re working with some excellent mid-market AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Melbourne teams.',
    linkedin_connected_message = 'Hope you''re settling in well with the Melbourne expansion! How are you finding the local talent market for building out your sales team? We''re seeing some interesting shifts in the market, particularly around mid-market AE hires in the privacy and compliance space. The growth in local privacy regulations is creating some unique opportunities for companies like OneTrust.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Giulia Francesca Pineda') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAYwYLIBYsB8Wo9yMNa5vv2gbpzhoG1vPh0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recpwxIwf8vdldLwJ',
    company_role = 'Vice President & Country Manager',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $1 billion Series K funding news. Huge milestone for Databricks!',
    linkedin_follow_up_message = 'We''re working with some excellent Engagement Manager candidates at the moment.',
    linkedin_connected_message = 'I see you''re hiring an Engagement Manager in Sydney at Databricks. How are you finding it with all the growth? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Adam Beavis') OR linkedin_url = 'https://www.linkedin.com/in/adambeavis')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recq1nSNFasBlnNIX',
    company_role = 'Senior Vice President, Europe & Asia-Pacific',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the APAC growth strategy through the Sydney office!',
    linkedin_follow_up_message = 'We''re working with some excellent senior account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the talent market across the region? We''re noticing some interesting shifts in the market, particularly around senior account management hires in the IT services space. The demand for experienced professionals who understand both local and regional dynamics has been really strong lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Byron Rudenno') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABJOhgBMxDrdpWxAv5izPepCIiU_Fs7K_8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recqEX11RBZY77B6g',
    company_role = 'Director Enterprise Sales',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the PayTo milestone news. 1M+ transactions is impressive!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates in the Sydney market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams during rapid growth phases.',
    linkedin_connected_message = 'I see you''re building out your BDR team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the landscape, particularly around sales development hires in fintech. The growth you''re seeing with enterprise customers like those PayTo partnerships must be creating some exciting opportunities for your team.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Chris Ponton Dwyer') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFvA1QBvKW9emMqnH2H_aS4TRiTtva3Vds')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recqPmhFoblnYAZl2',
    company_role = 'Head of Enterprise Sales & Partnerships | APAC',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the digital Forward product launch. Love seeing the innovation in SME payments.',
    linkedin_follow_up_message = 'We''re working with some excellent Account Managers in payments at the moment. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the account management talent market? We''re noticing some interesting shifts in the landscape, particularly around Client Account Manager hires in fintech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Dane Hart') OR linkedin_url = 'https://www.linkedin.com/in/dane-hart-1a20612')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recqWizVkBIv5yzOt',
    company_role = 'HR Operation and Payroll Manager APAC',
    employee_location = 'Singapore, Singapore',
    stage = 'connection_requested',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on closing the AIB Merchant Services acquisition! That''s fantastic news for the European expansion.',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Director candidates across fintech.',
    linkedin_connected_message = 'I see you''re building out your team for Fiserv. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in fintech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Alicia Boey') OR linkedin_url = 'https://www.linkedin.com/in/alicia-boey-40367488')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recqZZo1eyBzCVww9',
    company_role = 'Head Of Sales at Square AU',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw Square AI entered beta. That''s exciting for seller insights!',
    linkedin_follow_up_message = 'We''re working with some great onboarding specialists at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their seller enablement teams.',
    linkedin_connected_message = 'I see you''re building out your seller onboarding team. How are you finding the market? With all the new Square product launches, I imagine onboarding complexity is growing. We''re seeing some interesting shifts in the talent landscape, particularly around onboarding specialist hires in fintech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Colin Birney') OR linkedin_url = 'https://www.linkedin.com/in/colin-birney-17b4472')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recqaPwfz1TaFQwM0',
    company_role = 'Security Sales Director',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the Tech Data partnership news. Exciting for the ANZ market!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AE candidates at the moment, particularly those with government experience. Companies like HubSpot and Docusign have found our approach helpful when scaling their teams in competitive markets.',
    linkedin_connected_message = 'Hope you''re well Harry! I see you''re building out your federal government team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise AE hires in the government sector. With all the AI investment happening locally, there''s definitely more competition for quality sales talent. Would love to chat about what we''re seeing in the market.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Harry Chichadjian') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAyUsaoB0Tz0nauhFlIPnqYBWCA8fsvoWV0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recqtSN9Do1MtNIq7',
    company_role = 'New Business Sales Manager - ANZ',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the Sydney regional sales setup!',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise Account Manager candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise sales teams.',
    linkedin_connected_message = 'I see you''re building out your Enterprise Account Manager team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales hires in cybersecurity. The competition for quality AEs has definitely heated up locally.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Mel Lucas') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABWFjqsB6VGYEmVXqWINgzgqCMq3xRHH6cI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recqwgPEDcG9HOaqb',
    company_role = 'Manager, Sales & Sales Development Teams',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Deputy Payroll launch in Australia. That''s exciting!',
    linkedin_follow_up_message = 'We''re seeing some excellent account management talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their client-facing teams.',
    linkedin_connected_message = 'Hope you''re well James! I see Deputy''s really pushing the new payroll solution across Sydney. How are you finding the market response from hospitality and retail clients? We''re noticing some interesting shifts in the talent landscape, particularly around account management hires in workforce management.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('James P. Hunt') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABCHdYIBr00hL3lxiB51tJqoxgl9RhroRuk')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recr4uYc7Wbh38g8W',
    company_role = 'Vice President, Solutions Engineering - APJ',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the Gartner Magic Quadrant recognition. Well deserved!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some experienced CSMs in the cybersecurity space. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring CSMs at Netskope. How''s the market treating you? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Geoff Prentis') OR linkedin_url = 'https://www.linkedin.com/in/geoff-prentis-b00a564')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recr9dA9XQBAmIO15',
    company_role = 'Senior Sales Director - APAC',
    employee_location = 'Greater Brisbane Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the Sydney presence grow. Smart APAC expansion!',
    linkedin_follow_up_message = 'We''re working with some excellent senior account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC operations.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around account management hires in Sydney, particularly with the research and advisory space heating up.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Julian Lock') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEwvkQBLlxtnjb21fPWmyLZs0tTGTTsEEc')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recrJXIWpZzUFVdEu',
    company_role = 'General Manager, APAC',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $150M Series D news. Congrats on the funding!',
    linkedin_follow_up_message = 'We''re working with some strong SDR candidates in cybersecurity at the moment. Companies like HubSpot and Docusign have found our approach helpful for APJ expansion.',
    linkedin_connected_message = 'I see you''re building out your APJ sales team. How are you finding the market for SDRs in cybersecurity? We''re noticing some interesting shifts in the talent landscape, particularly around compliance tech hires in the region.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jonathon Coleman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAirubUBRn2XeS70vqtz-WyqwQ7mK1Z11f8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recrmnmpkClp0rGFH',
    company_role = 'Sales Manager',
    employee_location = 'Greater Melbourne Area, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw you''re with menumiz™. Love the work you''re doing in restaurant tech.',
    linkedin_follow_up_message = 'We''re working with some great BDE candidates at the moment. We helped HubSpot and Docusign with similar roles.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around BDE hires in restaurant tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Malik Ullah') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABSWS04BMpi9C8bpyrmAMOphd7E48o6biIc')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recsFIYqjezkFlA3E',
    company_role = 'Vice President & Managing Director, Australia & New Zealand',
    employee_location = 'Greater Sydney Area',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the news about the new Sydney office at Australia Square Plaza. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during expansion phases like yours.',
    linkedin_connected_message = 'I see you''re building out your team with the Sydney expansion. How are you finding the local talent market? We''re noticing some interesting shifts in the talent market, particularly around Account Manager hires in data security. The timing with your office opening must be creating some good opportunities.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Max McNamara') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAnGdWYBALQtJIhmsZDnsj9afulCjw0sSTI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recsSWpKQKyNR5ozq',
    company_role = 'Director, Sales',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney office expansion. Love the local growth!',
    linkedin_follow_up_message = 'We''re working with some excellent account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the landscape, particularly around account management hires in the SaaS space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Alex Burton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAT2048B122_qx9pya8C-AQ-92Uubs3z56Q')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recsSplvUkS6cyDKJ',
    company_role = 'Director of Sales',
    employee_location = 'Cremorne, New South Wales, Australia',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Better by SafetyCulture event in Sydney. That looked fantastic!',
    linkedin_follow_up_message = 'We''re working with some excellent senior AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise sales teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around senior AE hires in the SaaS space. The demand for enterprise sales talent in Sydney has been pretty intense lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Krista Gustafson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAzf1qABnShFldMvTWIzjUmD9JnMJRKLS1o')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recsXUWYVWDiOyJ3c',
    company_role = 'Regional Sales Manager, A/NZ',
    employee_location = 'Greater Sydney Area',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the Australian expansion. That Sydney SDR role looks exciting!',
    linkedin_follow_up_message = 'We''re seeing some strong SDR talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Australian teams.',
    linkedin_connected_message = 'I see you''re building out the Sydney team. How are you finding the talent market for SDR hires? We''re noticing some interesting shifts in the market, particularly around sales development roles in the data platform space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Paul Vella') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACVQxsBQ23KhD2UDsIPYFVsxKiaog4bj8M')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recsboZ42vIyN5NTL',
    company_role = 'Sales Manager',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the APAC expansion. Exciting growth in the region!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out their outbound teams.',
    linkedin_connected_message = 'I see you''re building out your SDR team. How are you finding the talent market across the region? We''re noticing some interesting shifts around outbound sales hires, particularly with companies scaling their remote teams in APAC.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jenny undefined') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAErssD8BlwGaYN-bKCKF2anROPEGrQGufbs')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recseSYfZzNJxPpkw',
    company_role = 'Head of GTM, APAC & Middle East, Investor Services',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney office launch news. That''s exciting to see Carta establishing local operations!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out local sales teams.',
    linkedin_connected_message = 'I see you''re building out the sales team locally. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in fintech. The move from remote to in-market teams seems to be a smart play for companies scaling in APAC.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Angus Kilian') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAemIT0Bjlhb_Q_wtH_oLuhi39NfoyMoP-g')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recspi8HgT7LJCNWp',
    company_role = 'Senior Account Director',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the WarpStream acquisition news. Great move expanding the platform capabilities.',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AEs at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their strategic sales functions.',
    linkedin_connected_message = 'I see you''re building out your enterprise sales team. How are you finding the market for strategic AEs? We''re noticing some interesting shifts in the data streaming space, particularly around enterprise sales hires in SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('James Delmar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADTlm0BkNi_VcjlJ7x9v7aG1UAWOF6uIcM')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recsylV4kkpeiH319',
    company_role = 'Senior Director Customer Success, Australia & New Zealand',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Gartner Customers'' Choice award for Cloud ERP. Well deserved!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong presales candidates in the AI space. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Presales Consultant for AI Growth at IFS. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Richard Wong') OR linkedin_url = 'https://www.linkedin.com/in/richardwongaustralia')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rect3C9njDEVqC6zO',
    company_role = 'Regional Sales Director',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the IPO filing news. Congrats on the NASDAQ listing!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong CSM candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring CSMs at Netskope. How are you finding it with all the growth? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Brian Zerafa') OR linkedin_url = 'https://www.linkedin.com/in/brianzerafa')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rectKW4AKpdXGqoOv',
    company_role = 'Sales Director, Global Cloud APAC',
    employee_location = 'Bendigo, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Series G news. $450M is huge - congrats Dan!',
    linkedin_follow_up_message = 'We''re working with some solid Sales Development Manager candidates in APAC at the moment.',
    linkedin_connected_message = 'I see you''re hiring a Sales Development Manager at Rippling. How''s the APAC market treating you? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Dan Shaw') OR linkedin_url = 'https://www.linkedin.com/in/danshawcontact')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rectNXY59eexHTyAb',
    company_role = 'Vice President APAC',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the VP APAC role! Love the Australian cloud expansion.',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases across the region.',
    linkedin_connected_message = 'I see you''re building out your Sydney team. How are you finding the talent market with all the rapid expansion happening across APAC? We''re noticing some interesting shifts in the landscape, particularly around Enterprise AE hires in the CX space. The regulated industries seem to be moving fast since the local cloud launch.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Simon Horrocks') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABADB4BO2VYiDBOL50nKw434VXBEgwfZgU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rectOFtYlqt5HMByS',
    company_role = 'AVP, Strategy & Operations APJ',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the SDR role posting for Melbourne. Great to see the local expansion!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent space, particularly around SDR hires in Melbourne. The demand for experienced enterprise sales talent has really picked up lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Antoine LeTard') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAA3NGUB42-pq_RDAlfX5Rx1rrIgcasgXMs')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rectRoRQ1pkMZeNO6',
    company_role = 'Senior Sales Director - ANZ',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the Sydney office expansion at Phillips Street. Exciting growth!',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases, particularly when building out senior sales roles in competitive markets.',
    linkedin_connected_message = 'I see you''re building out your Enterprise team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in cybersecurity. The Sydney market has been quite active lately, especially with companies scaling their sales functions. I run Launchpad, APAC''s largest invite-only GTM leader community, and also help companies like yours scale their teams through 4Twenty Consulting. Would love to share what we''re seeing in the market.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Justin Flower') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABKazoBJeCu9HJb7S11DpNkqgKgwa_KWxI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rectVS1YdbGNyICcw',
    company_role = 'Senior Sales Director (RVP)',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $1 billion Series K news. What a milestone for Databricks!',
    linkedin_follow_up_message = 'We''re working with some strong Engagement Manager candidates at the moment.',
    linkedin_connected_message = 'I see you''re hiring an Engagement Manager in Sydney at Databricks. How are you finding it with all the growth happening? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Chantelle Conway') OR linkedin_url = 'https://www.linkedin.com/in/chantelleconway')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rectVc3bJHbT9GI13',
    company_role = 'General Manager - Venue Team | Head of Strategy',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw Ordermentum hit $2 billion in transactions. What a milestone! Congrats on the achievement.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some experienced Sales Enablement candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a Sales Enablement Manager at Ordermentum. How are you finding it? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Isaac Lowrie') OR linkedin_url = 'https://www.linkedin.com/in/isaac-lowrie-80249131')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rectbmL5AVFH6uWXT',
    company_role = 'Regional Sales Manager',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing Cvent''s Melbourne office expansion!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Manager hires in Melbourne, especially with the events industry picking up momentum again.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Varun Sareen') OR linkedin_url = 'https://www.linkedin.com/in/ACwAADIbDxQBg11P5UG_5xS65BTEDXNu-4rZIZE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rectcO5nArXefQ8EP',
    company_role = 'Vice President APAC - Manufacturing Division',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the TrustRadius awards news. Congrats on the eight wins!',
    linkedin_follow_up_message = 'We''re working with some excellent Regional Sales Executives at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Regional Sales Executive hires in software solutions.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Andrew Mamonitis') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKve5kBeQOPGRXYdRfTBuoMZaGfyXFeeQM')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rectn64A84kMTQRZO',
    company_role = 'GM of ANZ, SEA and India',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney headquarters launch. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent senior sales candidates in the Sydney market at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC operations.',
    linkedin_connected_message = 'I see you''re building out the team with plans to double headcount. How are you finding the local talent market for sales roles? We''re noticing some interesting shifts around senior sales hiring in Sydney, particularly with the competition heating up for experienced APAC sales leaders.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Andrew McCarthy') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAP2OIEBhvmsGs4CE-6xJ22XbVoQB91JuM8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rectpbiQYNKRqy9n3',
    company_role = 'Head of Sales, Australia & New Zealand',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the OpenPay acquisition news. That''s exciting for the billing expansion!',
    linkedin_follow_up_message = 'We''re working with some strong SDR candidates in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the fintech talent market with all the growth happening? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in payments and fintech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Pete Waldron') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAANqzxEBHz3b05ITH52z87B8L8iyQ18Vyqw')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rects6EbyP1b9gzrC',
    company_role = 'Regional Sales Manager',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw OPSWAT at the Sydney Security Exhibition. Great local presence!',
    linkedin_follow_up_message = 'We''re working with some excellent cybersecurity sales professionals at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their regional teams.',
    linkedin_connected_message = 'I see you''re building out the regional sales team. How are you finding the cybersecurity talent market in Sydney? We''re noticing some interesting shifts in the market, particularly around sales hires in the cybersecurity space. With OPSWAT''s increased local presence through events and the new Sektor Cyber partnership, there''s clearly momentum building. Would love to chat about what we''re seeing in the market.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Brendon Mitchell') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADD53IBe7WZIzMPlk8jHd30OX2MieKnr2U')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'rectzxXmzoQnBzFMR',
    company_role = 'Regional Sales Director - South Pacific & A/NZ',
    employee_location = 'Greater Melbourne Area',
    stage = 'in queue',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Onfido acquisition news. Great move for the APAC market!',
    linkedin_follow_up_message = 'We''re working with some excellent senior sales professionals in the cybersecurity space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their government sales teams.',
    linkedin_connected_message = 'Hope you''re well Theo! I see you''re focused on the government sector. How are you finding the market for identity verification solutions? We''re noticing some interesting shifts in the talent space, particularly around senior sales roles in cybersecurity. The Onfido integration must be opening up some exciting opportunities for government clients.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Theo Gessas') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOKHQUBdgy57nX289k5GO6NuhEBGNivRUw')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recu3fRB91qDpA2zY',
    company_role = 'Sales Manager',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Milvus 2.6 release. Love seeing the AI infrastructure focus.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some excellent Enterprise AE candidates in the ANZ market. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring Enterprise AEs in ANZ at Zilliz. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Tiffany Nee') OR linkedin_url = 'https://www.linkedin.com/in/tiffany-nee-242b242bb')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recu7tk4T0w0wnJRl',
    company_role = 'Regional Sales Manager, APAC',
    employee_location = 'Australia',
    stage = 'connection_requested',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the Avasant recognition. Well deserved!',
    linkedin_follow_up_message = 'We''re working with some strong candidates in the tech consulting space.',
    linkedin_connected_message = 'I see you''re hiring for the Service Line Specialist role at Cognizant. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Michael Shnider') OR linkedin_url = 'https://www.linkedin.com/in/michael-shnider-9956303')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recu9I00xw9FOgiiI',
    company_role = 'Head of People & Talent',
    employee_location = 'Surry Hills, New South Wales, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Square partnership news. Love the bundled solution approach for hospitality venues.',
    linkedin_follow_up_message = 'We''re working with some strong BD candidates in hospitality tech at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the hospitality tech market? We''re noticing some interesting shifts in the talent landscape, particularly around BD hires in food tech and venue solutions.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('John Petty') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACASePcBfp1xMCAf2VWPg0ggvFrYu0mkcQY')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recuBBThoXHYTEdsf',
    company_role = 'Business Development Manager',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Ascend Australia summit in Melbourne. Love the local focus!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates in the fintech and fraud prevention space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their Sydney operations.',
    linkedin_connected_message = 'I see you''re building out your Sydney team. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around Account Executive hires in the fraud prevention space. The growth you''re seeing with local merchants like Cotton On and Meshki must be creating some exciting opportunities.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('David Chester🎗') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAUPjPgBAftV8amZGGGw37epDNR023KWRH4')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recuEwdgvzLQezEHA',
    company_role = 'Sales Director - Enterprise ANZ',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the new Sydney data centre launch. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases like yours.',
    linkedin_connected_message = 'I see you''re building out your team with the ANZ expansion. How are you finding the local talent market? We''re noticing some interesting shifts around Enterprise AE hiring in Sydney, especially with all the growth happening in the market right now.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Emma G.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEW-OMBSiUikiQc5od9J74QxJZrZw67yto')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recuT26bOW0ated68',
    company_role = 'Sales Director, APAC',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the capital raising news. Exciting times for the Sydney team!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during their expansion phases.',
    linkedin_connected_message = 'I see you''re building out your SDR team. How are you finding the local talent market? We''re noticing some interesting shifts around sales development hires in Sydney, particularly with companies scaling their GenieAI and go-to-market functions.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Zach Sevelle') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACvIM1YBsdxZ0yJ3OMSZsN5STupfrySEbwA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recuj8cGVdyCoeMFq',
    company_role = 'Regional Director, ASEAN',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Singapore partnership for APAC expansion. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent mid market AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their regional scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the talent market across the region? We''re noticing some interesting shifts in the landscape, particularly around mid market AE hires in cybersecurity. The demand for AI-powered security expertise has been incredible lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Sebastian M.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAjEKkcBfGx73aRaQ2GMjH-uJYbD_KS-PiQ')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recur4xxsoo7nwnCW',
    company_role = 'Sales Director, APAC',
    employee_location = 'Perth, Western Australia, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Weir acquisition news. That''s huge for Perth!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Tracksuit have found our approach helpful when scaling their teams during high growth phases.',
    linkedin_connected_message = 'Hope you''re well Mathew! With the Weir acquisition and all the growth at Micromine, I imagine you''re thinking about scaling the team. How are you finding the talent market in Perth? We''re seeing some interesting shifts around enterprise sales hires in the mining tech space, especially with all the activity happening locally.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Mathew Lovelock') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAFtMhgYBW-sYekAJIBGyT7vFrecRjJtruCI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recusL4GOkdaGuQwG',
    company_role = 'Head of Sales',
    employee_location = 'The Rocks, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the $250M ARR milestone. That''s exciting growth!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when they''re scaling their inbound teams.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the talent market in Sydney? We''re noticing some interesting shifts around SDR hiring, particularly with companies scaling as fast as Employment Hero. The demand for quality inbound sales talent has been pretty competitive lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Dave O''Connor') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAuWpZQBiUosv7otszGx3nMV5ok5qH-N3ZU')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recuweeSVz2qOHOJJ',
    company_role = 'Regional Sales Director',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw Cvent at AIME Melbourne. Love the local events focus!',
    linkedin_follow_up_message = 'We''re working with some excellent account management candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.',
    linkedin_connected_message = 'I see you''re building out your account management team in Melbourne. How are you finding the local talent market? We''re noticing some interesting shifts around account management hires in the events tech space, particularly with companies expanding their local presence like Cvent has been doing.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Harsha Hariharan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAYKGFgBN8QyhsDGGV_KqcG6vmWvR1nPN6U')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recvBbsB4iaIpwmfJ',
    company_role = 'Head of Sales | Singapore & Greater China Region',
    employee_location = 'Singapore',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the CloudTech partnership in Melbourne. Love the local momentum!',
    linkedin_follow_up_message = 'We''re working with some excellent sales talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases like this.',
    linkedin_connected_message = 'I see you''re building out your sales team in Victoria. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around sales director and AE hires in fintech. The expansion with CloudTech and other Melbourne partnerships suggests some exciting growth ahead.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Carol Sun') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAsI14IBuGinqMwJB3rao0IAXM9ubyukOlc')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recvCqnk4q9bmG3zT',
    company_role = 'Vice President International Sales',
    employee_location = 'Clovelly, Australia',
    stage = 'connection_requested',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw Securiti made CRN''s top 20 coolest network security companies. Congrats on the recognition!',
    linkedin_follow_up_message = 'We''re working with some strong channel sales professionals in cybersecurity at the moment. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out the channel sales function. How are you finding the cybersecurity market in ANZ? We''re noticing some interesting shifts in the talent landscape, particularly around channel sales hires in network security.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('John Cunningham') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAH_kIBbwloAtOae0M8CZPiAIYUYUKa4cI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recvOzeMkUtXWDkq4',
    company_role = 'Vice President of Sales',
    employee_location = 'Melbourne, Australia',
    stage = 'in queue',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on HCLTech being recognised as Global Alliances AI Partner of the Year! That''s fantastic news.',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Director candidates across enterprise software if you''re looking externally.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in enterprise software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ashutosh Uniyal') OR linkedin_url = 'https://www.linkedin.com/in/ashutoshuniyal1')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recvPAh0ed6Lb74gc',
    company_role = 'VP Sales, APAC',
    employee_location = 'Sydney, Australia',
    stage = 'lead_lost',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing APAC sales leaders building strong teams across the region.',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Director candidates across enterprise software.',
    linkedin_connected_message = 'I see you''re building out your team for Think & Grow. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in enterprise software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('De''Angello Harris') OR linkedin_url = 'https://www.linkedin.com/in/deangello')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recvPsd4mPt4pWvdo',
    company_role = 'Country General Manager, Malaysia GBS & Head of Strategic Accounts, SEA',
    employee_location = 'Singapore, Singapore',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the TikTok Shop launch! That''s been such an exciting development to watch.',
    linkedin_follow_up_message = 'We''re working with some excellent BDM candidates across tech.',
    linkedin_connected_message = 'I see you''re building out your team for TikTok. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around BDM hires in tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Nikhil Rolla') OR linkedin_url = 'https://www.linkedin.com/in/nikhilrolla')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recvTgdkiKeBSeS91',
    company_role = 'Regional Manager',
    employee_location = 'Brisbane, Queensland, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the international expansion focus at Sprinklr. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.',
    linkedin_connected_message = 'I see you''re building out your enterprise sales team. How are you finding the market for senior SDR talent? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise SDR hires in the CX space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Shane Brown') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAwISTQBtO7_eEoEDkNWw0NbFAighj9pqkY')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recvdw9gyw1Yj3day',
    company_role = 'Business Operations Manager',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the G2 High Performer awards for Firmable. Congrats on the recognition!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong GTM Systems candidates at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring a GTM Systems Engineer at Firmable. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Claire Burke') OR linkedin_url = 'https://www.linkedin.com/in/claire-burke-643137a7')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recvipTMhiETvEGd0',
    company_role = 'Senior Sales Director - APAC, at Info-Tech Research Group',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the Sydney expansion. Exciting APAC growth!',
    linkedin_follow_up_message = 'We''re working with some excellent senior account management candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their APAC scaling phases.',
    linkedin_connected_message = 'Hope you''re settling into the new role well! With Info-Tech''s APAC expansion through Sydney, how are you finding the market for building out account management teams? We''re seeing some interesting shifts in the talent landscape, particularly around senior account management hires in the research and advisory space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Chloe Frost') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATOy8oBGBIxKGKvs2pKBnzsUUPqxI1fb04')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recvl3j8ndsB3Icq4',
    company_role = 'Regional Sales Manager -APAC',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Breakthroughs 2025 webinar series. Love the innovation focus!',
    linkedin_follow_up_message = 'We''re seeing some strong renewals talent in the market at the moment. Companies like HubSpot and Docusign have found our approach helpful when building out their customer success teams.',
    linkedin_connected_message = 'I see you''re building out your renewals team. How are you finding the local talent market? We''re noticing some interesting shifts around customer success and renewals hires, particularly with companies scaling their Melbourne operations.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Eric H.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACgsyr4BJOzWqxWMZ_MYFZNTDfLwRJN6Zbw')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recvwU1AMRhpwL02u',
    company_role = 'Vice President Asia Pacific',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the ANZ Data Readiness report. Great insights on cyber resilience!',
    linkedin_follow_up_message = 'We''re working with some excellent Strategic Account Executive candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise sales teams.',
    linkedin_connected_message = 'I see you''re building out your team in Victoria. How are you finding the talent market across the region? We''re noticing some interesting shifts around Strategic Account Executive hires in data security, particularly with the increased focus on cyber resilience that your recent research highlighted.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Martin Creighan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADNZ3cBsk0mgZhMC0WDWCaE4aB2EoK0yds')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recwAQu0UuRMlUVTY',
    company_role = 'Country Manager - Australia/New Zealand',
    employee_location = 'Melbourne, Australia',
    stage = 'connection_requested',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Gigamon Insights launch. Love seeing the AI integration with SIEM platforms.',
    linkedin_follow_up_message = 'We''re working with some strong Regional Sales Directors in cybersecurity at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC teams.',
    linkedin_connected_message = 'I see you''re building out your regional team. How are you finding the cybersecurity sales talent market in APAC? We''re noticing some interesting shifts in the landscape, particularly around senior sales hires in enterprise security.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Nikolas Kalogirou') OR linkedin_url = 'https://www.linkedin.com/in/nikolas-kalogirou')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recwFnWC2LdzQKzSF',
    company_role = 'Senior Customer Success Manager',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the OnBoard AI launch. Love seeing the new features for board workflows.',
    linkedin_follow_up_message = 'We''re working with some strong SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around SDR hires in governance tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Khalid Khan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAc_7k0B80kgPmCvqMAB3MbT08jGJbbuqZM')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recwRKaoPnNqVoP6v',
    company_role = 'Client Director | Strategic Accounts ',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw KPMG''s $80M AI investment program announcement. That''s a serious commitment to transformation.',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some experienced Salesforce Directors at the moment. Happy to chat if useful.',
    linkedin_connected_message = 'I see KPMG is hiring a Salesforce Director. How''s the search progressing? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Neill Wiffin') OR linkedin_url = 'https://www.linkedin.com/in/neill-wiffin-4005805')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recwjSaQQ4IAy2gWu',
    company_role = 'Senior Business Development Manager',
    employee_location = 'Greater Perth Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Weir acquisition news. That''s exciting for Perth!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams during growth phases.',
    linkedin_connected_message = 'I imagine the Weir acquisition has you thinking about scaling the sales team. How are you finding the talent market in Perth? We''re seeing some interesting shifts around enterprise sales hires in mining tech, especially with all the growth happening locally.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Simon Moxham') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATs9EgBdZUiQhancsUrU7ycWwRJdHYLkhE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recwsAruTLeNAIASN',
    company_role = 'Global Sales Director',
    employee_location = 'Melbourne, Australia',
    stage = 'connection_requested',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw HelloTeams became a Microsoft-certified Operator Connect provider. Congrats on joining that select group!',
    linkedin_follow_up_message = 'We''re working with some strong Enterprise BDM candidates in the Teams space. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring Enterprise BDMs at HelloTeams. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jack Kruse') OR linkedin_url = 'https://www.linkedin.com/in/jack-kruse-24604a88')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recwuyHcYhpsb39Y2',
    company_role = 'Director of Sales - APAC',
    employee_location = 'Greater Melbourne Area',
    stage = 'connection_requested',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the LevelBlue acquisition news. Exciting times for APAC expansion!',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their scaling phases.',
    linkedin_connected_message = 'Hope you''re well Jo! I see you''re building out your Enterprise AE team. How are you finding the talent market across the region? We''re noticing some interesting shifts around enterprise sales hiring in cybersecurity, particularly with all the consolidation happening. Would love to chat about what we''re seeing in the market if you''re open to it.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jo Salisbury') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAArnDywBY-W_YMJElzFmFMFXDL6E2tPIiAk')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recx7Id8RVtrSe7Lp',
    company_role = 'Sales Manager',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on the strategic partnerships with Riyadh Air and LIFT! That''s fantastic news.',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates across enterprise software.',
    linkedin_connected_message = 'I see you''re building out your team for Sabre Corporation. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Manager hires in enterprise software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Susan Atike') OR linkedin_url = 'https://www.linkedin.com/in/susan-atike-a6356711')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recxUcOFQtVTC01Nq',
    company_role = 'National Sales Manager',
    employee_location = 'Greater Brisbane Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the corporate restructure into specialist businesses. Smart move!',
    linkedin_follow_up_message = 'We''re working with some excellent strategic account managers at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their ANZ teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the talent market for strategic account roles across the region? We''re noticing some interesting shifts in the market, particularly around senior sales hires in the IT services space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Marea Ford') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABAJwk8BTuJfmCiI88ilN9dQ7i3O0_J135o')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recxWx9vzXLMbFN8L',
    company_role = 'Government Sales Manager',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the MiClub partnership news. Great local success story!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise sales candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their senior sales teams.',
    linkedin_connected_message = 'I see you''re building out your enterprise sales team. How are you finding the market? We''re noticing some interesting shifts in the talent space, particularly around senior enterprise AE hires in cloud and cybersecurity. With Akamai''s APAC expansion and the growing demand for distributed cloud solutions, there''s definitely some movement happening. Would love to chat about what we''re seeing if you''re open to it.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Patrick Amate') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAWOCoEBb1BzJ6By4N64erm4kYLFYgu0Iao')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recxXDWYLTSMHZOC9',
    company_role = 'Regional Sales Manager (VIC)',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Zeller for Startups launch. Love seeing the expansion into that space!',
    linkedin_follow_up_message = 'We''re working with some strong mid-market AE candidates in fintech at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the mid-market AE talent pool? We''re noticing some interesting shifts in the fintech space, particularly around experienced AEs who can handle that segment.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Emilia Mosiejewski') OR linkedin_url = 'https://www.linkedin.com/in/ACwAADDsyU0Bt5aPXIdpLLB3eOhxeT-zvEYnncE')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recxhI9cq8igM1kBE',
    company_role = 'Sales Manager - Existing Business - APAC ',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Better by SafetyCulture event in Sydney. That''s exciting!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise AE candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams.',
    linkedin_connected_message = 'I see you''re building out your enterprise team. How are you finding the Sydney talent market? We''re noticing some interesting shifts in the talent space, particularly around senior AE hires in the SaaS sector. With SafetyCulture''s growth and that 3rd Best Place to Work recognition, you must be seeing strong interest from candidates.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Chelsea Sunderland') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAyVGeIB97GO5yB9sso-d4yKLPmt_7UKyR4')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recxhnxF9XvYK38nP',
    company_role = 'General Manager, APAC',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love the Sydney office growth as your APAC hub!',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their APAC teams.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Manager hires in Sydney, particularly with companies scaling their APAC operations.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Paul Wittich') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABjOGgBTkUkcQiZvJBsUactAXM7BKor0gg')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recxvZuSGjuDwrH32',
    company_role = 'Regional Head of Operations ',
    employee_location = 'Singapore, Singapore',
    stage = 'connection_requested',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Global Brands Magazine award news. Congrats on Best Digital Payment Solution Provider!',
    linkedin_follow_up_message = 'We''re working with some strong Sales Manager candidates in payments at the moment. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your team in Melbourne. How are you finding the payments talent market? We''re noticing some interesting shifts in the landscape, particularly around Sales Manager hires in fintech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Jeffrey Leong') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAC-Fa0BhrzNmohSDxecPWmmJe8_18C1seg')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recxzWxl51HuzL0dK',
    company_role = 'Revenue Enablement Manager',
    employee_location = 'Brisbane, Queensland, Australia',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the intelliHR rebrand to Humanforce HR. Smart move!',
    linkedin_follow_up_message = 'We''re working with some excellent presales candidates in the HCM space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their solutions teams.',
    linkedin_connected_message = 'I see you''re building out your presales team. How are you finding the local talent market? We''re noticing some interesting shifts in the talent landscape, particularly around Solutions Consultant hires in Sydney. The move to cloud and unified platform seems to be creating some great opportunities.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Laura Robinson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAkuEC0B7iQXxb-dGhQ2OtX7AVYipD10t_8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recy4yAz2Wq5Y3f3o',
    company_role = 'Head of Public sector, Health and Education delivery for Australia and New Zealand',
    employee_location = 'Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Q2 results news. Great to see the strong performance!',
    linkedin_follow_up_message = 'We''re working with some strong candidates in the tech consulting space.',
    linkedin_connected_message = 'I see you''re hiring for the TMT Service Line Specialist role at Cognizant. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Mukti Prabhu, GAICD') OR linkedin_url = 'https://www.linkedin.com/in/muktiprabhu')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recyGENWenh0noaE6',
    company_role = 'Sales Director',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the CloudTech partnership news. Love the Melbourne expansion!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise sales candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their local teams.',
    linkedin_connected_message = 'I see you''re building out your sales team in Victoria. How are you finding the local talent market? We''re noticing some interesting shifts around enterprise sales hires in fintech, especially with all the momentum Fireblocks has been building locally. The Zerocap partnership and Project Acacia involvement really seem to be opening doors across the region.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Matt Perkes') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAo41fkBA1mBJRDnAK211cbu31oTQKeju3I')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recyHlYtF43xyzvnz',
    company_role = 'Large Enterprise Account Director',
    employee_location = 'Greater Sydney Area',
    stage = 'new',
    confidence_level = 'Medium',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing Sprinklr''s international expansion focus. Exciting times!',
    linkedin_follow_up_message = 'We''re working with some excellent enterprise SDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales development teams.',
    linkedin_connected_message = 'I see you''re building out your enterprise sales team. How are you finding the market for senior SDR talent? We''re noticing some interesting shifts in the talent landscape, particularly around enterprise sales development roles in SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Rob Arora') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA4K_R8B4hxf9HttcFkpLDWImCu4S5R_HWc')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recyUVSHamGvBpFYI',
    company_role = 'Sales Enablement Manager',
    employee_location = 'Adelaide, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on being named among the top 30 digital marketing agencies in Sydney for 2025! That''s fantastic recognition.',
    linkedin_follow_up_message = 'We''re working with some excellent Head of Sales candidates across digital marketing if you''re looking externally.',
    linkedin_connected_message = 'I see you''re building out your team for Zib Digital Australia. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Head of Sales hires in digital marketing.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Tony Walkley') OR linkedin_url = 'https://www.linkedin.com/in/tonywalkley')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recyXi4r9eKUwsjlc',
    company_role = 'Area Vice President, ANZ',
    employee_location = 'Greater Melbourne Area',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Melbourne SDR role posting. Exciting local growth!',
    linkedin_follow_up_message = 'We''re working with some excellent SDR candidates in Melbourne at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their sales teams in competitive markets.',
    linkedin_connected_message = 'I see you''re building out your sales team. How are you finding the local talent market? We''re noticing some interesting shifts around experienced SDR hires in Melbourne, particularly with the demand for 3+ years enterprise experience that seems to be the new standard.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Altay Ayyuce') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAJ7z4AB4W-UAe3qALVwshm3r1SLwVEtbZ8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recybZzn3lZjl04Z6',
    company_role = 'Sales Director, APJ - ANZ',
    employee_location = 'Melbourne, Victoria, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney office expansion at Australia Square. Exciting growth!',
    linkedin_follow_up_message = 'We''re working with some excellent AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during rapid scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the local talent market? We''re noticing some interesting shifts around Account Executive hires in Sydney, especially with all the growth happening in cybersecurity right now.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Sarah Jarman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAADBXEFUBIeEdfQjPkp1MWp2yCUJ7xf3j0zI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recyeFdD4na10NVPi',
    company_role = 'Head of Strategic Partnerships, APAC',
    employee_location = 'Sydney, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the strategic partnerships with Riyadh Air and LIFT! Must be an exciting time in your role.',
    linkedin_follow_up_message = 'We''re working with some excellent Account Manager candidates across enterprise software if you''re looking externally.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around Account Manager hires in enterprise software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Shane Lowe') OR linkedin_url = 'https://www.linkedin.com/in/shane-lowe-64204455')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recysBAWEGQQD2rUg',
    company_role = 'Director of Sales',
    employee_location = 'Bendigo, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Series G news. $450M is massive - congrats!',
    linkedin_follow_up_message = 'We''re working with some experienced Sales Development talent in Sydney at the moment.',
    linkedin_connected_message = 'I see you''re hiring a Sales Development Manager at Rippling. How are you finding the Sydney market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('James Demetrios') OR linkedin_url = 'https://www.linkedin.com/in/james-demetrios-596096b0')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recz6q1ijSZaF9VBU',
    company_role = 'Director, Regional Sales',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Microsoft partnership news. Great move for Netskope!',
    linkedin_follow_up_message = 'Hope you''re well! We''re working with some strong CSM candidates in cybersecurity. Happy to chat if useful.',
    linkedin_connected_message = 'I see you''re hiring CSMs at Netskope. How are you finding the market? We work with companies like HubSpot on similar roles.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ravi Chandar') OR linkedin_url = 'https://www.linkedin.com/in/ravichandar')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reczBj20GjXPpN3Lr',
    company_role = 'Head of Enterprise, ANZ',
    employee_location = 'Greater Sydney Area, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the platform upgrade news with the new AI features. Love seeing the innovation at Contentsquare.',
    linkedin_follow_up_message = 'We''re working with some excellent Enterprise AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the market? We''re noticing some interesting shifts in the talent landscape, particularly around Enterprise AE hires in analytics and SaaS.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Damon Etherington') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKVNDcBG892ycvxNPP-_gIBDQUZcO0mVMs')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reczFh7JbA60aFiX0',
    company_role = 'Senior Vice President & Managing Director - Asia Pacific & Japan',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love that you''re anchoring APAC operations from Sydney. Great base for the region!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their regional teams.',
    linkedin_connected_message = 'I see you''re building out your BDR team. How are you finding the talent market across the region? We''re noticing some interesting shifts in the landscape, particularly around business development hires in HR tech. The demand for quality BDRs who understand the APAC market dynamics has been pretty strong lately.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Paul Broughton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAD887EBrT2xyWideBuXvcWwwp0jTEoYcbA')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reczGPRI3ksBCfbks',
    company_role = 'GM of ANZ, SEA and India',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Sydney headquarters launch. Exciting local expansion!',
    linkedin_follow_up_message = 'We''re working with some excellent sales managers in the Sydney market at the moment. Companies like HubSpot and Docusign have found our approach helpful during these rapid scaling phases.',
    linkedin_connected_message = 'I see you''re building out the team there. How are you finding the local talent market? We''re noticing some interesting shifts in the landscape, particularly around sales manager hires in Sydney. With plans to double the team, I imagine you''re seeing the competition firsthand.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Andrew McCarthy') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAP2OIEBhvmsGs4CE-6xJ22XbVoQB91JuM8')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reczaCr3uNwf2fmrD',
    company_role = 'State Manager - Victoria',
    employee_location = 'Greater Melbourne Area, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Square partnership news. Great move for venue operators!',
    linkedin_follow_up_message = 'We''re working with some strong Business Development candidates in hospitality tech at the moment. Companies like HubSpot and Docusign have found our approach helpful during growth phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the hospitality tech talent market? We''re noticing some interesting shifts in the landscape, particularly around Business Development hires in food tech.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Lewis Steere') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACE3Ry4B4IYhJz2Cv54qnuQo4qw_IY2Ieso')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reczcYGAJWd0EqR4G',
    company_role = 'Managing Director Australia',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Love seeing the Sydney team expansion. That''s exciting growth!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates in Sydney at the moment. Companies like HubSpot and Docusign have found our approach helpful during scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team in Sydney. How are you finding the local talent market? We''re noticing some interesting shifts around BDR hires in fintech, particularly with the growth happening in Barangaroo.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Pat Bolster') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAIzlQEBbRKtxGd4t4-JIMxf1JH2hiE4BWc')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reczel0ew6m0BWo9c',
    company_role = 'MD APAC',
    employee_location = 'Randwick, Australia',
    stage = 'in queue',
    confidence_level = NULL,
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the CopadoCon India success. Love seeing that growth in the region!',
    linkedin_follow_up_message = 'We''re working with some strong BDR candidates in the Salesforce ecosystem. Companies like HubSpot and Docusign have found our approach helpful.',
    linkedin_connected_message = 'I see you''re building out your BDR team. How are you finding the Salesforce talent market? We''re noticing some interesting shifts in the landscape, particularly around BDR hires in the DevOps space.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Brett Waters') OR linkedin_url = 'https://www.linkedin.com/in/muddywaters')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recziU0VUxmZa9oBu',
    company_role = 'APAC Commercial Sales Manager',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Anacle acquisition news. Exciting APAC expansion!',
    linkedin_follow_up_message = 'We''re working with some excellent account management candidates at the moment, particularly those with proptech and SaaS experience. Companies like HubSpot and Docusign have found our approach helpful when scaling their enterprise teams in this market.',
    linkedin_connected_message = 'Hope you''re well Ki! I see MRI''s really scaling up the APAC operations with the recent acquisition and Melbourne office growth. How are you finding the market as you build out the account management team? We''re seeing some interesting shifts in the talent landscape, particularly around enterprise sales hires in proptech. The demand for experienced account managers who understand both residential and commercial property tech is definitely heating up.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ki Currie') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABUA8IIBMS9dHI4yCdaRcyDvzwf7guhYwqI')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reczj7M20lbjxhCYh',
    company_role = 'GRC Solution Sales Director',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Diligent Connections 2025 event in Sydney. Exciting times!',
    linkedin_follow_up_message = 'We''re working with some excellent BDR candidates in the GRC space at the moment. Companies like HubSpot and Docusign have found our approach helpful when scaling their business development teams.',
    linkedin_connected_message = 'Hope you''re well Gavin! I see you''re in the BDR space at Diligent. How are you finding the market for GRC talent in Sydney? We''re noticing some interesting shifts in the talent landscape, particularly around business development hires in the compliance and governance space. The AI focus at your upcoming February event suggests some exciting growth ahead.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Gavin James Vermaas') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACCn8ABF1GLONyPMwmeaszSP_tkM3_1UMY')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'recztVMs8FF6mKhQj',
    company_role = 'Director and Sector Lead for Energy, Utilities and Resources -ANZ',
    employee_location = 'Melbourne, Australia',
    stage = 'new',
    confidence_level = NULL,
    lead_source = '',
    automation_started_at = NOW(),
    linkedin_request_message = 'Congrats on HCLTech being recognised as Dell Technologies'' 2025 Global Alliances AI Partner of the Year! That''s fantastic news.',
    linkedin_follow_up_message = 'We''re working with some excellent Sales Director candidates across enterprise software if you''re looking externally.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the internal market? We''re noticing some interesting shifts in the talent landscape, particularly around Sales Director hires in enterprise software.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Ashutosh Razdan') OR linkedin_url = 'https://www.linkedin.com/in/ashutosh-razdan-4718a74')
  AND airtable_id IS NULL;

UPDATE people SET 
    airtable_id = 'reczzKeY3kebF8lzD',
    company_role = 'VP APJ',
    employee_location = 'Sydney, New South Wales, Australia',
    stage = 'new',
    confidence_level = 'High',
    lead_source = 'LinkedIn Job Posts',
    automation_started_at = NOW(),
    linkedin_request_message = 'Saw the Singapore partnership news. Exciting APAC expansion!',
    linkedin_follow_up_message = 'We''re working with some excellent mid market AE candidates at the moment. Companies like HubSpot and Docusign have found our approach helpful during their regional scaling phases.',
    linkedin_connected_message = 'I see you''re building out your team. How are you finding the talent market across the region? We''re noticing some interesting shifts in the landscape, particularly around mid market AE hires in cybersecurity. The APAC expansion must be opening up some great opportunities.',
    updated_at = NOW()
WHERE (LOWER(name) = LOWER('Tim Bentley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACafEQBBT8hVHbuJIxI3c1Uesg3Zxs0rP8')
  AND airtable_id IS NULL;



-- INSERT NEW PEOPLE RECORDS

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec00K14ZaDrRx7L1', 'Collection mohit', 'Sales Manager', 'Australia', 'https://www.linkedin.com/in/collection-mohit-82ba96363', 'connection_requested', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Collection mohit') OR linkedin_url = 'https://www.linkedin.com/in/collection-mohit-82ba96363'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec0OJCtqkanR0vxY', 'Emma-Jayne Owens', 'RVP Sales - APJ ', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAA1jxUoB8W7J34scDcXBGbzb5Xl7wRASflk', 'connected', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Emma-Jayne Owens') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA1jxUoB8W7J34scDcXBGbzb5Xl7wRASflk'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec0QFvn5fa8ZcC7y', 'David Phillips', 'Lead Account Manager - Financial Services', 'Melbourne, Australia', 'https://www.linkedin.com/in/david-phillips-a6017315', 'new', 'Low', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('David Phillips') OR linkedin_url = 'https://www.linkedin.com/in/david-phillips-a6017315'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec0kSyo4N7LWp7uS', 'Cameron Fenley', 'Enterprise Strategic Sales ', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAABMPCwBwtvgbuWS1nwCKDbwXWXM3Dtn4CI', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Cameron Fenley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABMPCwBwtvgbuWS1nwCKDbwXWXM3Dtn4CI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec0kd22pifT1Midg', 'Stephanie French', 'Subcontractor Sales Manager', 'Greensborough, Australia', 'https://www.linkedin.com/in/stephanie-jayne-french', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Stephanie French') OR linkedin_url = 'https://www.linkedin.com/in/stephanie-jayne-french'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec0koPZSD5QJ1bFe', 'Anne-Sophie Purtell', 'Head of Sales ANZ', 'Australia', 'https://www.linkedin.com/in/ACwAABBLFcoB4kjxzEw-7FhKBEL5DT5YEriMrQk', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Anne-Sophie Purtell') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABBLFcoB4kjxzEw-7FhKBEL5DT5YEriMrQk'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec0qQAnW80XI17ko', 'Warren Reid', 'Sales Director', 'Perth, Western Australia, Australia', 'https://www.linkedin.com/in/ACwAAAITVkkBHrOao1Ug57X0mrS78RCvA1BBXok', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Warren Reid') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAITVkkBHrOao1Ug57X0mrS78RCvA1BBXok'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec12qIgXB6vOTdsP', 'Martin Evans', 'Regional Sales Manager', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAfOYRkB36BcMY5G7qNc7Y1SIVAa7NFISkM', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Martin Evans') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAfOYRkB36BcMY5G7qNc7Y1SIVAa7NFISkM'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec1M3yBI49uSQTGT', 'Nick Bowden', 'Regional Vice President, Strategic | Enterprise ANZ at Elastic', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAASE0GwBUTqx4FSOSdFRRRxeCATs7hyPi6M', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Nick Bowden') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAASE0GwBUTqx4FSOSdFRRRxeCATs7hyPi6M'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec1NpANJAnAPPojx', 'Sumit Bansal', 'Vice President of Sales, Asia', 'Singapore, Singapore', 'https://www.linkedin.com/in/ACwAAAAD1-4Bv2H3r1qIqN3e8o1YLI2l5S_zaQ8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Sumit Bansal') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAD1-4Bv2H3r1qIqN3e8o1YLI2l5S_zaQ8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec1OBrIhuK084uFV', 'Brendan Irwin', 'Country Manager, Australia & New Zealand', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAABB8F40BVkrydHCArjZg8jbmcObPWculdeQ', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Brendan Irwin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABB8F40BVkrydHCArjZg8jbmcObPWculdeQ'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec1evCimTBK0iOGL', 'Nicola Gerber', 'Vice President, AsiaPacific and Japan', 'Singapore', 'https://www.linkedin.com/in/ACwAAABQq6MBZVWnEzmK0yv9eztk4sqdrwGrToA', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Nicola Gerber') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABQq6MBZVWnEzmK0yv9eztk4sqdrwGrToA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec1hqDZyU1fwF7wj', 'Chloe Frost', 'Senior Sales Director - APAC, at Info-Tech Research Group', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAATOy8oBGBIxKGKvs2pKBnzsUUPqxI1fb04', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Chloe Frost') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATOy8oBGBIxKGKvs2pKBnzsUUPqxI1fb04'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec1lVxqstS6qCJyj', 'Ryan Joseph Rialp', 'Senior Manager', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAACJ6uycBCpbyzgJntKJOIKEOtPHYnno1LXs', 'in queue', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ryan Joseph Rialp') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACJ6uycBCpbyzgJntKJOIKEOtPHYnno1LXs'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec1mOrlAay4bo519', 'Christina Chung', 'Head of Business Development - Australia & New Zealand', 'Sydney, Australia', 'https://www.linkedin.com/in/christina-chung', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Christina Chung') OR linkedin_url = 'https://www.linkedin.com/in/christina-chung'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec1rEmTGHA8l4ypj', 'Jordan K.', 'Sales Director', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAATy2SQBPzgGAyPa95PZxVbr_8UIedh-a7M', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jordan K.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATy2SQBPzgGAyPa95PZxVbr_8UIedh-a7M'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec1sriUFAMAjIY1p', 'Daniel Corridon', 'Director of GTM - Enterprise', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAABBxrngBGEbkNtq6m9iih8UN7r0XG6R7sdo', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Daniel Corridon') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABBxrngBGEbkNtq6m9iih8UN7r0XG6R7sdo'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec1zDHjb3DIvNsqs', 'Sharryn Napier (She/Her)', 'Vice President, Asia Pacific, India, Japan & China', 'Balgowlah Heights, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAABBiewBkXeaLKsSk49j4wmiGc3DeZqZMfU', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Sharryn Napier (She/Her)') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABBiewBkXeaLKsSk49j4wmiGc3DeZqZMfU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec1zg6dNH94IPduv', 'Chris Haylock', 'Head of Strategy & Business Development', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAAzhbMBH8Iy2y3097UEVhbWdKiokK5or6A', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Chris Haylock') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAzhbMBH8Iy2y3097UEVhbWdKiokK5or6A'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec1zoRpvOVDSxxMx', 'Jothi Kumar', 'Global Sales Leader - Emerging Regions / APAC', 'Sydney, Australia', 'https://www.linkedin.com/in/jothikumar79', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jothi Kumar') OR linkedin_url = 'https://www.linkedin.com/in/jothikumar79'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec21j6M2JF4v640k', 'Bharani Iyer', 'Vice President and Business Unit Head for Diversified Industries HCL ANZ', 'Melbourne, Australia', 'https://www.linkedin.com/in/bharani-iyer-74335a1', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Bharani Iyer') OR linkedin_url = 'https://www.linkedin.com/in/bharani-iyer-74335a1'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec2HdUTDiLfyeGdO', 'Adriana De Souza', 'Director of GTM Operations', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAA6MOgYBhmR8sBQsZP51f4zuWG5S3AKbZM4', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Adriana De Souza') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA6MOgYBhmR8sBQsZP51f4zuWG5S3AKbZM4'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec2YeOIJ3zn0fUMm', 'Andrew Fogarty', 'Regional Sales Director', 'Sydney, Australia', 'https://www.linkedin.com/in/andrew-fogarty-30a50616', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Andrew Fogarty') OR linkedin_url = 'https://www.linkedin.com/in/andrew-fogarty-30a50616'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec2d48SihMgn9YpE', 'Pamela Ong', 'Country Manager, Singapore and Asia', 'Singapore', 'https://www.linkedin.com/in/ACwAAA7fXHMBV3-4aX6TzAEMzoUT5hp76T_3zYQQ', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Pamela Ong') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA7fXHMBV3-4aX6TzAEMzoUT5hp76T_3zYQQ'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec2kkHX0gKQ4fXC7', 'Peter Scott', 'Country Lead', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAABxsBr0BgdzzgxhrmBZaXkisQrQ6kqdOLVA', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Peter Scott') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABxsBr0BgdzzgxhrmBZaXkisQrQ6kqdOLVA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec3Ad9QAqMUTScTf', 'Ben Luke', 'Senior General Manager - Business Sales (Australia & NZ)', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAgVxQcBmjd5aASGoXWgSi6eqNRYGqlPnAA', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ben Luke') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAgVxQcBmjd5aASGoXWgSi6eqNRYGqlPnAA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec3RqQ4jP82lbaGz', 'Joe Widing', 'Strategic Sales Director', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAA9XAa4B7EqiXQUQpM4HnNUis0xM2_jb0so', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Joe Widing') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA9XAa4B7EqiXQUQpM4HnNUis0xM2_jb0so'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec40mD2H9KCU0gAV', 'Mike Hawley', 'Sales Director', 'Brisbane, Australia', 'https://www.linkedin.com/in/devicie', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Mike Hawley') OR linkedin_url = 'https://www.linkedin.com/in/devicie'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec44Gkgf3MFl7oDt', 'Charlotte Buxton', 'Enterprise Sales Manager', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAAtZsYgBHap28_PCkeYpoWUf5Cn2X9W7PlE', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Charlotte Buxton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAtZsYgBHap28_PCkeYpoWUf5Cn2X9W7PlE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec44K9sjaC3bD2V0', 'Julia Ren', 'General Manager, Greater China', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAAADh_D0BNBHCUg4PhpfLENYwiBmXx__Gd4A', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Julia Ren') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADh_D0BNBHCUg4PhpfLENYwiBmXx__Gd4A'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec47pVJsMkXTGu2d', 'Lawrence Tso', 'Senior Sales Manager, Rocket Software', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAAqqoboBrfkUw34a8QY7yN-j2WrcMwEV2VI', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Lawrence Tso') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAqqoboBrfkUw34a8QY7yN-j2WrcMwEV2VI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec4RI186zcGpWoGT', 'Ross F.', 'Senior Director, JAPAC [Corporate Sales] SMB + Mid Market', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAA0-WuEBXO7QWVqrHhZ4M-AZoRGTqK7ymDQ', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ross F.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA0-WuEBXO7QWVqrHhZ4M-AZoRGTqK7ymDQ'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec4Relc9xy8sSDpP', 'Rheniel Ibalio', 'Mid Market Account Executive', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAAzJKloBvrV5a623LPRHbs6_FSEgvwRYUew', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Rheniel Ibalio') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAzJKloBvrV5a623LPRHbs6_FSEgvwRYUew'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec4SBW8m2Mi4yFjs', 'Natasha Pennells', 'Sales Operations Team Lead', 'Greater Brisbane Area', 'https://www.linkedin.com/in/ACwAAAk3d34BQkLx9HB_l1nwazHOwj8zNZb2Dp0', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Natasha Pennells') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAk3d34BQkLx9HB_l1nwazHOwj8zNZb2Dp0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec4bXgbw2X1qTZRL', 'Myron Stein', 'Head of Enterprise Sales ANZ', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAZIOwEB2WvSyiTux-O-rFO3nDXu-Gvqnos', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Myron Stein') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAZIOwEB2WvSyiTux-O-rFO3nDXu-Gvqnos'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec4hc6wNFQQXaX7V', 'Chris Smith', 'SVP & Managing Director (Schneider Elec Company)', 'Brisbane, Queensland, Australia', 'https://www.linkedin.com/in/ACwAABm6ASEBzzBzDZ_yvRylPSt2GwsT-fZzyig', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Chris Smith') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABm6ASEBzzBzDZ_yvRylPSt2GwsT-fZzyig'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec4scUKzjZ3jLifP', 'Crispin Kerr', 'Area Vice President, ANZ', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAABTqNsBl_XPBoNJeSKyvLMlvefUr6L6hKY', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Crispin Kerr') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABTqNsBl_XPBoNJeSKyvLMlvefUr6L6hKY'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec5GbWrYQysZNviw', 'James Ross', 'RVP - Regional Vice President, ANZ', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAABYri0B4I-oxo8ZDk1JZfJ7jLr04ssQO3I', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('James Ross') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABYri0B4I-oxo8ZDk1JZfJ7jLr04ssQO3I'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec5L4zgPoF9LgclG', 'Steve Grubmier', 'Director of Partner Connect APAC', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAo2lo0BPOe8g0ui3dmfbZovRdes1vmCeDM', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Steve Grubmier') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAo2lo0BPOe8g0ui3dmfbZovRdes1vmCeDM'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec5ORnkmQy4WQxyy', 'Matt Davison', 'Senior Client Executive', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAfKVC0BSk2eB6jmnlN_gjKX3Zv91odoDk4', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Matt Davison') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAfKVC0BSk2eB6jmnlN_gjKX3Zv91odoDk4'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec5SLGtXoTU7ohh5', 'Greg Baxter', 'Sales Manager', 'Greater Brisbane Area', 'https://www.linkedin.com/in/ACwAAACtdcYBhlO8gs2rAxPPi2sJ1Rf-ruf2Q70', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Greg Baxter') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACtdcYBhlO8gs2rAxPPi2sJ1Rf-ruf2Q70'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec5g7FeTjD7aCmH5', 'Kylie Green', 'Managing Director - APAC', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAqg3lMBsYSUyVow2jTs08Rd2LNJqr6Ytuw', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Kylie Green') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAqg3lMBsYSUyVow2jTs08Rd2LNJqr6Ytuw'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec66RaPyoqSHx05F', 'Trent McCreanor', 'Global Head of Sales', 'Gold Coast, Queensland, Australia', 'https://www.linkedin.com/in/ACwAABAtl1sBKMWjbLJW05P3pX_vznUl-AFj5UI', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Trent McCreanor') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABAtl1sBKMWjbLJW05P3pX_vznUl-AFj5UI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec69HmRrMRNvDwJV', 'Jonathan Chua', 'Senior Inside Sales Manager', 'Singapore', 'https://www.linkedin.com/in/ACwAABsOXUsB-1py8q8LNvzMdsvxTc-YF4VXtsg', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jonathan Chua') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABsOXUsB-1py8q8LNvzMdsvxTc-YF4VXtsg'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec69wC19ZPRYDVcb', 'Jordan Akers', 'Sales Director, APAC', 'Melbourne, Australia', 'https://www.linkedin.com/in/ACwAABGMQscBBGeZZ8BYa_-lS4sTEjvzRKafm7k', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jordan Akers') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABGMQscBBGeZZ8BYa_-lS4sTEjvzRKafm7k'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec6G7Ge7E71rN2P7', 'Jonathan Mathers', 'Sales Director', 'Manly West, Queensland, Australia', 'https://www.linkedin.com/in/ACwAAAxyRmcBVUhXPlThfi0RzWXoodZD0OFpME4', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jonathan Mathers') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAxyRmcBVUhXPlThfi0RzWXoodZD0OFpME4'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec6RoukZ1l5LM40z', 'Daniel Lawrence', 'Major Account Executive FSI & Critical Infrastructure', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAGaZLUBshsiFpzXx7PoBY_X2j-S_NGpIEA', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Daniel Lawrence') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAGaZLUBshsiFpzXx7PoBY_X2j-S_NGpIEA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec6dod4hTQTj5MRQ', 'Polly Parker', 'Enterprise Sales Manager', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAAdR2UYBf976d6piwzdm_lU8vcJpGsiKuO0', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Polly Parker') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAdR2UYBf976d6piwzdm_lU8vcJpGsiKuO0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec6qLkHfUpNxIz68', 'Eric Rollett', 'Director of Channel Partnerships - Australia', 'North Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAB-eTABP-Rtrl-CBifx9QYSK5veSL_DNNQ', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Eric Rollett') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAB-eTABP-Rtrl-CBifx9QYSK5veSL_DNNQ'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec6whP1uYEtfk6zs', 'Andrew Wilkins', 'Head of Channel Sales AU & NZ', 'Sydney, Australia', 'https://www.linkedin.com/in/andrewjwilkins', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Andrew Wilkins') OR linkedin_url = 'https://www.linkedin.com/in/andrewjwilkins'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec70chjeQIIFwh8t', 'Tom Jackson', 'Director - Sales & Customer Success', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAArTmzIBDeODYiSoDDTlhbal9wFVOVoIy_8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Tom Jackson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAArTmzIBDeODYiSoDDTlhbal9wFVOVoIy_8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec7HEx7QFxCGlMIy', 'Jack Mullard', 'Head of Commercial', 'Moonee Ponds, Victoria, Australia', 'https://www.linkedin.com/in/ACwAACPgIgIByrpSDkR7GuyUBh5VfIxt3a4JwoE', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jack Mullard') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACPgIgIByrpSDkR7GuyUBh5VfIxt3a4JwoE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec7a7tgYJk0XgsEt', 'Cheryl Duggan', 'A/NZ Subscription & Annuity (Renewals) Manager', 'Sydney, Australia', 'https://www.linkedin.com/in/cheryl-duggan-bb15145', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Cheryl Duggan') OR linkedin_url = 'https://www.linkedin.com/in/cheryl-duggan-bb15145'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec7eOwX23WQUdquS', 'Christie Taylor', 'State Sales Manager NSW, WA & QLD - National Automotive Lead', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAAdcstcBJEGkDyseKpNbUzRfKZkITBvEzw8', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Christie Taylor') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAdcstcBJEGkDyseKpNbUzRfKZkITBvEzw8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec7mfO6oOEQhgoVJ', 'Jude Don', 'Channel Partner Manager', 'Sydney, Australia', 'https://www.linkedin.com/in/judedon', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jude Don') OR linkedin_url = 'https://www.linkedin.com/in/judedon'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec7ukafotWKuEHjN', 'Mohammed Fouladi', 'Director - Product Strategy & Enablement', 'St Leonards, Australia', 'https://www.linkedin.com/in/mfouladi', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Mohammed Fouladi') OR linkedin_url = 'https://www.linkedin.com/in/mfouladi'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec7vijxIzx48dS2S', 'Geoff Davies', 'VP and Country Manager ANZ', 'Sydney, Australia', 'https://www.linkedin.com/in/geoffdavies1', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Geoff Davies') OR linkedin_url = 'https://www.linkedin.com/in/geoffdavies1'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec89IHoaNat7uQLL', 'Daniel Wong', 'Head of Enterprise Sales and Account Management, ASEAN and North Asia', 'Singapore, Singapore', 'https://www.linkedin.com/in/daniel-wong-20775721', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Daniel Wong') OR linkedin_url = 'https://www.linkedin.com/in/daniel-wong-20775721'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec8Dw396b3CqLbKk', 'Izzy Hettiarachchi', 'Senior Manager, Account Management - Asia, Africa, and Australasia', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAANZUSQBYc-KPrH339AbJ2TCO0JbYnwOKKo', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Izzy Hettiarachchi') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAANZUSQBYc-KPrH339AbJ2TCO0JbYnwOKKo'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec8EIClgmmkcKDTM', 'Leo Zhang', 'Principal Sales Operations Manager', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAT6qq8BbjTrWvzDIbrK3ZVjGjaRvtL_Cfk', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Leo Zhang') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAT6qq8BbjTrWvzDIbrK3ZVjGjaRvtL_Cfk'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec8FKT64UecPW2t4', 'Michael Hull', 'Regional Director', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAB9bQ4BG34nJ2m_iV8ndahqhZobl3N0fd8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Michael Hull') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAB9bQ4BG34nJ2m_iV8ndahqhZobl3N0fd8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec8QSRxfJteUQ4Bz', 'Adam Brew', 'General Manager', 'Perth, Western Australia, Australia', 'https://www.linkedin.com/in/ACwAAAhAqd0Bjs5Lwxsp7wy9DT87z-7eXIZ8vqo', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Adam Brew') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAhAqd0Bjs5Lwxsp7wy9DT87z-7eXIZ8vqo'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec8Vi5fK6o1xrjqJ', 'Sruthi K.', 'Senior Director - Field & Member Services', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAhct7UBcE7tc2KOCHERSIAjhOJeNf-Br4E', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Sruthi K.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAhct7UBcE7tc2KOCHERSIAjhOJeNf-Br4E'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec8XrWa34AfLsT3f', 'Pavel Kamychnikov', 'Head of Sales - APAC', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAAdebqMBamtw7bVKv4XhaFK1825UvkrcWg0', 'lead_lost', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Pavel Kamychnikov') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAdebqMBamtw7bVKv4XhaFK1825UvkrcWg0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec8nM8D0Nyse0nWq', 'Naina Vishnoi', 'Senior Sales Director - APAC & IMEA, Suppliers & venue solutions', 'Singapore, Singapore', 'https://www.linkedin.com/in/ACwAAAVivAoBbrNnODb27V6QMaM4i55BiYGy7jY', 'connected', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Naina Vishnoi') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAVivAoBbrNnODb27V6QMaM4i55BiYGy7jY'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec9fL9vJCtOI3Lu4', 'James Hanna', 'National Sales Manager', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAAAAdJxgBfLuWUw2RDn2WmSgyS-DoB9F5kw0', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('James Hanna') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAdJxgBfLuWUw2RDn2WmSgyS-DoB9F5kw0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec9mIBN2s6QiKiZZ', 'Margaret Selianakis', 'Sales Manager', 'Brunswick, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAAAnwFMBLTKYN4izcEKNVTJlklxIWqRaZz8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Margaret Selianakis') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAnwFMBLTKYN4izcEKNVTJlklxIWqRaZz8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec9q2wlHikQ8gG0L', 'David Wright', 'Regional Vice President (RVP) A/NZ', 'Australia', 'https://www.linkedin.com/in/ACwAAASgczwB3c_Jy9Yy1mSBWoRzqSRtnNehDGI', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('David Wright') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAASgczwB3c_Jy9Yy1mSBWoRzqSRtnNehDGI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec9tENYimdhE2txc', 'Isobel Shurley', 'Director ANZ Sales Operations, Global Sales Operations', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAkW-q4BRyYG2FKlqmS04ASROo4reH6Jd6A', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Isobel Shurley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAkW-q4BRyYG2FKlqmS04ASROo4reH6Jd6A'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rec9y8lp1H1fDmSms', 'Kiran Ajbani', 'Sr Regional Sales Director', 'Melbourne, Australia', 'https://www.linkedin.com/in/kiranajbani', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Kiran Ajbani') OR linkedin_url = 'https://www.linkedin.com/in/kiranajbani'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recA5zyxdE11Asofv', 'Randeep Chhabra', 'Sales Leader - Asia Pacific and Japan (Application Security)', 'Melbourne, Australia', 'https://www.linkedin.com/in/randeep-chhabra-3581b26', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Randeep Chhabra') OR linkedin_url = 'https://www.linkedin.com/in/randeep-chhabra-3581b26'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recALzvi9TUNcDtAA', 'Avi Ben-Galil', 'Director of Business Development& Partnerships, EMEA & APAC', 'Singapore', 'https://www.linkedin.com/in/ACwAAA8ffksBtqrpyvh-1x5tG3A2kryAdKNfhxc', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Avi Ben-Galil') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA8ffksBtqrpyvh-1x5tG3A2kryAdKNfhxc'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recAVEfKluCdO3422', 'Jaye Vernon', 'Area Vice President, ANZ', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAABlQoaMBrAFqQD7MksNFiJ-i4u4clOxYse0', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jaye Vernon') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABlQoaMBrAFqQD7MksNFiJ-i4u4clOxYse0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recAWrugQA8E0WNB5', 'Adrian Valois', 'Senior Manager, Enterprise Sales ', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAABAXBnUBaOY1Vl_Lm1GYO2HAEE2RuRfT_P8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Adrian Valois') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABAXBnUBaOY1Vl_Lm1GYO2HAEE2RuRfT_P8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recArXdx1MRnheDud', 'Aaron Thorne', 'Chief Sales Officer', 'Australia', 'https://www.linkedin.com/in/ACwAABGzwZUBA5LAplhseW7ZywUqYZgNT7uwujA', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Aaron Thorne') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABGzwZUBA5LAplhseW7ZywUqYZgNT7uwujA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recB1ZLio9tCZRIer', 'Eric Seah', 'Channel Director Asean', 'Singapore', 'https://www.linkedin.com/in/ACwAAAEw5YMBlGqi0hOaj20kgnfkKxxTlM52zak', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Eric Seah') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEw5YMBlGqi0hOaj20kgnfkKxxTlM52zak'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recBe4y2QYxu0jkqU', 'Georgia Hinks', 'Sales Manager', 'Gaythorne, Australia', 'https://www.linkedin.com/in/georgia-hinks-7443b034a', 'connection_requested', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Georgia Hinks') OR linkedin_url = 'https://www.linkedin.com/in/georgia-hinks-7443b034a'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recBkUkl1dvVaO0AL', 'Rosie Courtier', 'Sales Manager, Business Development', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAB6P9ikBoPVoGdTWSGB5xcwF8ekUnHiMus4', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Rosie Courtier') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAB6P9ikBoPVoGdTWSGB5xcwF8ekUnHiMus4'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recBpKzlIqEuc39EH', 'Angus MacRae', 'Senior Sales Operations Manager', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAABjmy_0B8deeVR5o8IayMxX1GsSLutw0QM4', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Angus MacRae') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABjmy_0B8deeVR5o8IayMxX1GsSLutw0QM4'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recBqR8dj4h6Aaff9', 'Farooq Fasih Ghauri', 'Managing Director AU / NZ- Regional Director APAC', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAAAXn808BJihsG8YgOUwvVWxpPBY3RS5yP8U', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Farooq Fasih Ghauri') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAXn808BJihsG8YgOUwvVWxpPBY3RS5yP8U'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recC3jcIBsyEwOW2s', 'Dan Hartman', 'Sales Director, Commercial', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAABAkdiABz4AQpCa8WN-GpRLmkiBPdFnyDYI', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Dan Hartman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABAkdiABz4AQpCa8WN-GpRLmkiBPdFnyDYI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recC61FhHRn6WCuHt', 'Kim Gardiner', 'Director Corporate Sales APAC', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAv-VjcBeFpwkNt8Joe8QCb2W-DiWV0yCgA', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Kim Gardiner') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAv-VjcBeFpwkNt8Joe8QCb2W-DiWV0yCgA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recCBb75CHviEe1J8', 'Reece Watson', 'Vice President, Sales & Customer Success', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAAfRa-8BKkZ1A6rDggqIIjQfuTFV_Uq8s6s', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Reece Watson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAfRa-8BKkZ1A6rDggqIIjQfuTFV_Uq8s6s'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recCD7F1y38E15hXB', 'Gareth Parker', 'VP Sales, Asia Pacific', 'Australia', 'https://www.linkedin.com/in/ACwAAAFNYkwBhoK2hXsy39aXjdmy-7_w2IApl1k', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Gareth Parker') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFNYkwBhoK2hXsy39aXjdmy-7_w2IApl1k'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recCIA74gbbx8wL12', 'Yue Wang', 'VP of Sales APAC', 'Singapore, Singapore', 'https://www.linkedin.com/in/yue-wang-721317280', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Yue Wang') OR linkedin_url = 'https://www.linkedin.com/in/yue-wang-721317280'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recCWv1EAS9cBvdq4', 'Polly Parker', 'Enterprise Sales Manager', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAAdR2UYBf976d6piwzdm_lU8vcJpGsiKuO0', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Polly Parker') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAdR2UYBf976d6piwzdm_lU8vcJpGsiKuO0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recCeTunTD5V3zj0l', 'Oliver Godwin', 'Manager, Commercial Sales ANZ', 'Sydney, Australia', 'https://www.linkedin.com/in/oliver-godwin-603833178', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Oliver Godwin') OR linkedin_url = 'https://www.linkedin.com/in/oliver-godwin-603833178'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recCgo0RcsrPYcplH', 'Keith Chen', 'Head of Business, Singapore', 'Singapore, Singapore', 'https://www.linkedin.com/in/ACwAAAeJN90BfvO6ltDf-p_IYsCKyk-KOuB25qU', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Keith Chen') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAeJN90BfvO6ltDf-p_IYsCKyk-KOuB25qU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recChRe2stvwzpEhw', 'Justin Barlow', 'Territory Sales Manager - ANZ', 'Greater Brisbane Area', 'https://www.linkedin.com/in/ACwAAATvy-AB0svvj7XMtSSMWyfogHSNf-xBbek', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Justin Barlow') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATvy-AB0svvj7XMtSSMWyfogHSNf-xBbek'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recCviIMZke1LDLEL', 'Serene Foo', 'Assistant Director, Public Relations (Asia Pacific)', 'Singapore, Singapore', 'https://www.linkedin.com/in/ACwAAB5RaFoBV8KjFjdzBBYcS36HQhtfaQVkAus', 'new', 'Low', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Serene Foo') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAB5RaFoBV8KjFjdzBBYcS36HQhtfaQVkAus'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recD8qWuOHscqZdjA', 'Steven Clement', 'VP of Sales', 'North Narrabeen, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAEb4DUBeUwi6SQDUVdEgo6OeU2nxm9Z0n8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Steven Clement') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEb4DUBeUwi6SQDUVdEgo6OeU2nxm9Z0n8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recDKzLrskXw13hwA', 'Lorena Casillas', 'Growth Marketing Lead', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAAArZtHcBuwryEeDIF-jhYJxtymiKqkKFhgg', 'new', 'Low', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Lorena Casillas') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAArZtHcBuwryEeDIF-jhYJxtymiKqkKFhgg'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recDOVaQh3eqKb42L', 'Suhail Ismail', 'Sales Director', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAA8POsUBAIK11SjhnMOOuawfoGcHyfmyezU', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Suhail Ismail') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA8POsUBAIK11SjhnMOOuawfoGcHyfmyezU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recDQoJ16cq1xDNe3', 'Steven Newman', 'Commercial Manager', 'Brisbane, Queensland, Australia', 'https://www.linkedin.com/in/ACwAAANOCu4BS8cuqi05PQq5R9ZYNqoeR_tzY6w', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Steven Newman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAANOCu4BS8cuqi05PQq5R9ZYNqoeR_tzY6w'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recDRuSgo75dHVAy5', 'Mark Henderson', 'Sales Director @ShiftCare', 'Australia', 'https://www.linkedin.com/in/ACwAAAWqQYAB5z24_8cQjHckIE9DDjkt5ldZan8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Mark Henderson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAWqQYAB5z24_8cQjHckIE9DDjkt5ldZan8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recDjf3njedZothfQ', 'Andrew Maresca', 'Sales Leader - Asia Pacific & Japan', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAGm_ngBlrNLRD8VjSJg2E0g4YGtaqjmggM', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Andrew Maresca') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAGm_ngBlrNLRD8VjSJg2E0g4YGtaqjmggM'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recDnNqETYEy30FdY', 'Sam Salehi', 'Managing Director ANZ', 'Melbourne, Australia', 'https://www.linkedin.com/in/ACwAAADw8q0BPsC8bsHeAWjHfZdpavb__4oqcrc', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Sam Salehi') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADw8q0BPsC8bsHeAWjHfZdpavb__4oqcrc'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recDwNVna2H5DYHZo', 'Luke Corkin', 'Director of Sales, Enterprise & Strategic', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAASHenMBnjTJ7sZ5hQFwcICyOduXaznsUJA', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Luke Corkin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAASHenMBnjTJ7sZ5hQFwcICyOduXaznsUJA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recEAeRQdwSI5MjfU', 'Michael van Zoggel', 'General Manager - WA', 'Perth, Australia', 'https://www.linkedin.com/in/ACwAAAQnMoEBHcV6X9lOylMcccIYqzK79CQ1vIs', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Michael van Zoggel') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAQnMoEBHcV6X9lOylMcccIYqzK79CQ1vIs'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recED41KqdkZSijCZ', 'Tom Tokic', 'Regional Vice President of Sales - APJ', 'Canberra, Australian Capital Territory, Australia', 'https://www.linkedin.com/in/ACwAAABznFYBZk-gXM3qpGrIN-NKxhDHFngk5co', 'replied', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Tom Tokic') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABznFYBZk-gXM3qpGrIN-NKxhDHFngk5co'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recEMzFWrI1jx4zoB', 'Arnold Chan', 'General Manager, Australia & New Zealand', 'Melbourne, Australia', 'https://www.linkedin.com/in/ACwAAARePtUBmXogWwJ6w5A7SG378L6NTyuXunE', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Arnold Chan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAARePtUBmXogWwJ6w5A7SG378L6NTyuXunE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recETIRbIREFhHMm5', 'Steve Bailey', 'Embedded IoT Sales and Key Account Executive', 'Melbourne, Australia', 'https://www.linkedin.com/in/stevenmichaelbailey', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Steve Bailey') OR linkedin_url = 'https://www.linkedin.com/in/stevenmichaelbailey'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recEd6tILCyiLh43z', 'Kane McMonigle', 'Sales Manager', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAgrtBMBUprFiMISkY6p8LzUnQIOvbJXeL4', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Kane McMonigle') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAgrtBMBUprFiMISkY6p8LzUnQIOvbJXeL4'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recEfBn7fJ5Cgczle', 'Peter Coulson', 'Vice President  of Sales - Asia Pacific & Japan', 'Singapore, Singapore', 'https://www.linkedin.com/in/ACwAAAuwb78B8XQx_C0DX5QZmF4eqynyaDms8oU', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Peter Coulson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAuwb78B8XQx_C0DX5QZmF4eqynyaDms8oU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recEfMzFcIyfKzu32', 'Max Ebdy', 'Regional Sales Director', 'Singapore', 'https://www.linkedin.com/in/ACwAABdB_7cBM62q2SH3Vho3ZDP9K6meoahdCVc', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Max Ebdy') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABdB_7cBM62q2SH3Vho3ZDP9K6meoahdCVc'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recEfXyn4cpUyvhOR', 'Jimmy Wang', 'Sales Manager', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAACR6moABzsa_EZsbxlgZadJgk8PyfyhwK5Y', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jimmy Wang') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACR6moABzsa_EZsbxlgZadJgk8PyfyhwK5Y'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recEyTd7dEORQMnVz', 'Will Griffith', 'GM and Head of GTM APAC', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAAApjv8BZppnh4puYzrxFdpefiFqGKLoZ8k', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Will Griffith') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAApjv8BZppnh4puYzrxFdpefiFqGKLoZ8k'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recEzGaiHYLuuv6AP', 'Cam O''Riordan', 'VP Sales and Revenue', 'Sydney, Australia', 'https://www.linkedin.com/in/camoriordan', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Cam O''Riordan') OR linkedin_url = 'https://www.linkedin.com/in/camoriordan'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recF1XZSgkqaHKVFk', 'Clayton Bennell ☁️', 'Senior Sales Executive - Associate Director - Microsoft Government & Enterprise Accounts ANZ', 'Melbourne, Australia', 'https://www.linkedin.com/in/clayton-bennell-☁️-627aa258', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Clayton Bennell ☁️') OR linkedin_url = 'https://www.linkedin.com/in/clayton-bennell-☁️-627aa258'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recF2IC4BHBgPJmxG', 'Damon Scarr', 'General Manager, Asia Pacific at Sage', 'Sydney, Australia', 'https://www.linkedin.com/in/damonscarr', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Damon Scarr') OR linkedin_url = 'https://www.linkedin.com/in/damonscarr'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recF2IE7TURv5zWKE', 'Daniel Skaler', 'National iRetail Key Account Manager', 'Melbourne, Australia', 'https://www.linkedin.com/in/daniel-skaler-8ba8519', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Daniel Skaler') OR linkedin_url = 'https://www.linkedin.com/in/daniel-skaler-8ba8519'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recF9izJdT0hkL97c', 'Dan Franklin', 'Director, Regional Sales, AU/NZ', 'Greater Adelaide Area, Australia', 'https://www.linkedin.com/in/ACwAAA0FUvABwDeQ2fjqPTgKNWXlwefMopbUXro', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Dan Franklin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA0FUvABwDeQ2fjqPTgKNWXlwefMopbUXro'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recFPoGRmiBcNmSui', 'Onur Dincer', 'Regional Sales Leader -Japan, Korea & Queensland', 'Brisbane, Australia', 'https://www.linkedin.com/in/onur-dincer-a115881', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Onur Dincer') OR linkedin_url = 'https://www.linkedin.com/in/onur-dincer-a115881'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recFTJ0dNMTahCXz8', 'Matt Carter', 'Enterprise Sales', 'Sydney, Australia', 'https://www.linkedin.com/in/mrc102', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Matt Carter') OR linkedin_url = 'https://www.linkedin.com/in/mrc102'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recFVJJnnlMYUpNGu', 'Chloe Frost', 'Senior Sales Director - APAC, at Info-Tech Research Group', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAATOy8oBGBIxKGKvs2pKBnzsUUPqxI1fb04', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Chloe Frost') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATOy8oBGBIxKGKvs2pKBnzsUUPqxI1fb04'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recFVqOV6GbpEGK3L', 'Tercio Couceiro', 'Senior Sales Director', 'Melbourne, Australia', 'https://www.linkedin.com/in/tcouceiro', 'replied', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Tercio Couceiro') OR linkedin_url = 'https://www.linkedin.com/in/tcouceiro'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recFYbTUhsrbBmp6K', 'Jade Marishel GAICD', 'Head of Sales, APAC', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAAAgYWagBvtREM89QnXm5qpQARI8g2G13r50', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jade Marishel GAICD') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAgYWagBvtREM89QnXm5qpQARI8g2G13r50'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recFfzpLJUN32iooi', 'Scott Smedley', 'Head of Sales and Go to Market Australia and New Zealand', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAAA9EIEBGPlCaGHKHov3-n3mR4O_vgOu6Pg', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Scott Smedley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAA9EIEBGPlCaGHKHov3-n3mR4O_vgOu6Pg'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recFm9AwEgS2K4Eks', 'James Meischke', 'National Sales Manager', 'Sydney, Australia', 'https://www.linkedin.com/in/jamesmeischke', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('James Meischke') OR linkedin_url = 'https://www.linkedin.com/in/jamesmeischke'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recFqSeEcsM0Ke8MT', 'Sarah Rowley', 'Senior Product Manager, Issuing', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAV9TdcBAIRl3VJyUwn3KS2pGWj5QqajpHE', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Sarah Rowley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAV9TdcBAIRl3VJyUwn3KS2pGWj5QqajpHE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recFxsZZQpQlugE64', 'Tony Spencer', 'Area Manager - North QLD', 'North Mackay, Queensland, Australia', 'https://www.linkedin.com/in/ACwAAADsZLcBJKcinOvAXKxXZXnX6uBDWxqTLbw', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Tony Spencer') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADsZLcBJKcinOvAXKxXZXnX6uBDWxqTLbw'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recG9dGhxLLYtIpFe', 'Matthew Lowe', 'Regional Director, Pacific', 'Sydney, Australia', 'https://www.linkedin.com/in/matthew-lowe-1722357', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Matthew Lowe') OR linkedin_url = 'https://www.linkedin.com/in/matthew-lowe-1722357'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recGA0gV1wIachk0t', 'Carly Roper', 'Vice President - Sales ANZ', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAAEUaeMBmM10JokHFgt5BftA6MD-ojBQR_I', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Carly Roper') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEUaeMBmM10JokHFgt5BftA6MD-ojBQR_I'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recGGTsczhOxZfQiX', 'Gareth Moore', 'Head of Sales - ERP', 'Sydney, Australia', 'https://www.linkedin.com/in/gareth-moore-479b453', 'connected', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Gareth Moore') OR linkedin_url = 'https://www.linkedin.com/in/gareth-moore-479b453'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recGHwJVwIQDYKiXu', 'Henry Zhou', 'Managing Director', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAAKQkroBpUiARR_xTuGn672dW1aRVUEWDIY', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Henry Zhou') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKQkroBpUiARR_xTuGn672dW1aRVUEWDIY'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recGckz5fgUb6GS8A', 'Jarod Hart', 'Sales Manager', 'Sydney, Australia', 'https://www.linkedin.com/in/jarod-hart', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jarod Hart') OR linkedin_url = 'https://www.linkedin.com/in/jarod-hart'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recGctl9jI3NHa1bc', 'Cherie Chay', 'HR Business Partner, ASEAN & Greater China', 'Singapore, Singapore', 'https://www.linkedin.com/in/cheriechay', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Cherie Chay') OR linkedin_url = 'https://www.linkedin.com/in/cheriechay'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recGh32zdTsK3iNW3', 'David Barrow', 'Director', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAABAkj64B4ddLP85lR_pcQnJdH2I1ipbMmY8', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('David Barrow') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABAkj64B4ddLP85lR_pcQnJdH2I1ipbMmY8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recGq60bpkBg7QcGi', 'Claudia Kidd', 'Strategic Growth Lead', 'Malvern, Australia', 'https://www.linkedin.com/in/claudia-loritsch-0028', 'lead_lost', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Claudia Kidd') OR linkedin_url = 'https://www.linkedin.com/in/claudia-loritsch-0028'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recGqwuyhBGmACZHD', 'Darren Paterson', 'Regional Vice President of Sales, Australia and New Zealand', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAFnAbABB6kXiXPhSquzADLJ7M1418CsD2A', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Darren Paterson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFnAbABB6kXiXPhSquzADLJ7M1418CsD2A'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recGspGlgPaPi8pZS', 'Aaron Berthelot', 'Senior General Manager - Consumer Sales & Marketing Oceania', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAATzHfkBxxd1rkUUDAwDjv5X9t_Vpi6hn1g', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Aaron Berthelot') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATzHfkBxxd1rkUUDAwDjv5X9t_Vpi6hn1g'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recGtvdPnf9opfDzs', 'Paul Richardson', 'Chief Commercial Officer (CCO)', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAA3WGk0BrLm9zH0msivV2hPTCBaIPhvphYA', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Paul Richardson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA3WGk0BrLm9zH0msivV2hPTCBaIPhvphYA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recGyf7hoIO3QfrMP', 'Sesh Jayasuriya', 'Regional Director APAC', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAAlVBVoB0gzz0U88FjUwi5UzcRpK87z9a10', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Sesh Jayasuriya') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAlVBVoB0gzz0U88FjUwi5UzcRpK87z9a10'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recH2FMa9Axddx20M', 'Shannon King', 'Region Manager - EOR HR Services - APAC', 'Bendigo, Australia', 'https://www.linkedin.com/in/shannon-king-284247209', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Shannon King') OR linkedin_url = 'https://www.linkedin.com/in/shannon-king-284247209'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recH8gjwvYpuUr7wP', 'Mario Leonidou', 'Head of Internal Sales', 'Sydney, Australia', 'https://www.linkedin.com/in/mario-leonidou-37189782', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Mario Leonidou') OR linkedin_url = 'https://www.linkedin.com/in/mario-leonidou-37189782'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recHfZnwd7umrGemh', 'Dallen Yi Zhao Long', 'Sales Manager', 'Australia', 'https://www.linkedin.com/in/ACwAAFc9WaUBmnvt216HmUTQuePCDZ9NbBd3P1E', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Dallen Yi Zhao Long') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAFc9WaUBmnvt216HmUTQuePCDZ9NbBd3P1E'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recHq1ZqkBSyTEe94', 'Julian Lock', 'Senior Sales Director - APAC', 'Greater Brisbane Area', 'https://www.linkedin.com/in/ACwAAAEwvkQBLlxtnjb21fPWmyLZs0tTGTTsEEc', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Julian Lock') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEwvkQBLlxtnjb21fPWmyLZs0tTGTTsEEc'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recHs0etnpI9cElmV', 'Robert G.', 'General Manager - APAC', 'Adelaide, Australia', 'https://www.linkedin.com/in/robogibson', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Robert G.') OR linkedin_url = 'https://www.linkedin.com/in/robogibson'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recHslXwMye6iGi9o', 'Jose Alba', 'Regional Alliances Manager', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAABp0P4BizQ4PIl1EYubzv36gMz8P23im3c', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jose Alba') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABp0P4BizQ4PIl1EYubzv36gMz8P23im3c'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recHz7QcPhQjYtlC3', 'Dylan Clough', 'Sales Director', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAACtzQOoBZCrnudu08ui52_pDqNVyVbM83ZI', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Dylan Clough') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACtzQOoBZCrnudu08ui52_pDqNVyVbM83ZI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recIYbf9CYlArBDrZ', 'Clare Bagoly', 'Head of Sales Development', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAgoZ6UB1K_OAxoCglQ0rqMtB7d7cjL4cqE', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Clare Bagoly') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAgoZ6UB1K_OAxoCglQ0rqMtB7d7cjL4cqE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recIiLd2Kcgx9ihbi', 'Anthony Connors', 'NSW Sales Manager at Mediaform Pty Ltd', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAABQIYM8B2OOUVKGURSjr4_DjDpVPccj-fcc', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Anthony Connors') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABQIYM8B2OOUVKGURSjr4_DjDpVPccj-fcc'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recIovhxLzLlXShW2', 'Victor Yong', 'WA State Sales Manager', 'Perth, Western Australia, Australia', 'https://www.linkedin.com/in/ACwAACsJ868BrutfqQXc1vOJWfwda-fnTYGVA8g', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Victor Yong') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACsJ868BrutfqQXc1vOJWfwda-fnTYGVA8g'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recIuYuzACMPttPna', 'Ash Rahman', 'Sales Director', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAABDg628B_Y-v7llDQ3Y0hxHvSxpnaRgZFkc', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ash Rahman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABDg628B_Y-v7llDQ3Y0hxHvSxpnaRgZFkc'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recJ5XhyhUN201IDx', 'Nicole Daley', 'Group Sales Manager (Non-Endemic), AUNZ - Amazon Ads', 'Queenscliff, Australia', 'https://www.linkedin.com/in/nicole-daley-28953496', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Nicole Daley') OR linkedin_url = 'https://www.linkedin.com/in/nicole-daley-28953496'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recJHUBH1s3fMpLfK', 'Louis Whelan', 'Head of Sales', 'Australia', 'https://www.linkedin.com/in/ACwAABHrwZMB9yI9VFTGNQzzfG_CFwGKWzxSOt0', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Louis Whelan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABHrwZMB9yI9VFTGNQzzfG_CFwGKWzxSOt0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recJHUBmRntO3bBl0', 'Thana Jahairam', 'Human Resources Generalist APAC', 'Gaythorne, Australia', 'https://www.linkedin.com/in/thana-jay-1986mar31', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Thana Jahairam') OR linkedin_url = 'https://www.linkedin.com/in/thana-jay-1986mar31'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recJOdicG5FDEdbOI', 'Wei Li Lim', 'Revenue Operations', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAABsPiCwBrG8YQ12Wce-tKg4K7Ov4oAsuKog', 'in queue', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Wei Li Lim') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABsPiCwBrG8YQ12Wce-tKg4K7Ov4oAsuKog'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recJQ7lsPrxs3f5y5', 'Craig Bastow', 'Area Vice President and Country Manager, Australia and New Zealand', 'Greater Brisbane Area', 'https://www.linkedin.com/in/ACwAAA3Eb3oBFH0AjvBXND_dkY9sIp6WXduZeR0', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Craig Bastow') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA3Eb3oBFH0AjvBXND_dkY9sIp6WXduZeR0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recJVvzrbEFhRKw31', 'Prem Kumar', 'Regional Sales Manager ASEAN', 'Singapore', 'https://www.linkedin.com/in/ACwAACLVMZUBklKivFNcriWs9qSF_q4Yu3eTyDA', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Prem Kumar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACLVMZUBklKivFNcriWs9qSF_q4Yu3eTyDA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recJXgwmNwlnNZK4l', 'Marea Ford', 'National Sales Manager', 'Greater Brisbane Area', 'https://www.linkedin.com/in/ACwAABAJwk8BTuJfmCiI88ilN9dQ7i3O0_J135o', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Marea Ford') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABAJwk8BTuJfmCiI88ilN9dQ7i3O0_J135o'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recJkk1rNYiEzCxPh', 'Sheree Springer', 'Manager, Technical Account Management', 'Sydney, Australia', 'https://www.linkedin.com/in/sheree-springer-713312118', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Sheree Springer') OR linkedin_url = 'https://www.linkedin.com/in/sheree-springer-713312118'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recJrf6jGiRdvWnVi', 'Kiran Mudunuru', 'Sales Director (DevOps, AI & Automation)', 'Melbourne, Australia', 'https://www.linkedin.com/in/kiranmudunuru', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Kiran Mudunuru') OR linkedin_url = 'https://www.linkedin.com/in/kiranmudunuru'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recJxv4GcazALbfSm', 'Will van Schaik', 'Sales Manager', 'Elwood, Victoria, Australia', 'https://www.linkedin.com/in/ACwAABLBMIEBBX6aqIpFyxL5kJNXFYlFsJK2NLE', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Will van Schaik') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABLBMIEBBX6aqIpFyxL5kJNXFYlFsJK2NLE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recJyMca1dd1rZ7KR', 'Todd Wellard', 'Regional Sales Director - ANZ', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAAABK3C4BCoyqBabJEkd-lgMlA6BrcN53iOg', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Todd Wellard') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABK3C4BCoyqBabJEkd-lgMlA6BrcN53iOg'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recK2wLxAill7suvH', 'Janelle Havill', 'Head of Sales Development ', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAABLVLPQBojhbU1IAhtwpQGm94qKS2mHrv40', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Janelle Havill') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABLVLPQBojhbU1IAhtwpQGm94qKS2mHrv40'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recK6TDaunmISiOU2', 'Allan Wang', 'Director of Sales, Australia and New Zealand', 'Barangaroo, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAwclRIB7mIFiDcjfsuWmXJqAGe7r6h-7vk', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Allan Wang') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAwclRIB7mIFiDcjfsuWmXJqAGe7r6h-7vk'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recK7kOdWqMqZN4wt', 'Damien Olbourne', 'Alliances Director, ANZ + ASEAN', 'Randwick, Australia', 'https://www.linkedin.com/in/olbourne', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Damien Olbourne') OR linkedin_url = 'https://www.linkedin.com/in/olbourne'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recK8450yDIedgSkm', 'Kenny Soutar', 'Country Manager - ANZ', 'Greater Melbourne Area, Australia', 'https://www.linkedin.com/in/ACwAAAAQq4EB4S4PwcwJHr_mzLqTtx3XvkjtSuA', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Kenny Soutar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAQq4EB4S4PwcwJHr_mzLqTtx3XvkjtSuA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recKHyrOzFsZMvr5K', 'Fabian Teo', 'Regional Sales Director', 'Singapore', 'https://www.linkedin.com/in/ACwAAAt4lU0BTAXs2v_U3qXhuslwguuYR2UBiks', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Fabian Teo') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAt4lU0BTAXs2v_U3qXhuslwguuYR2UBiks'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recKKwV5jBWsJ6LtF', 'Lisa Cunningham', 'Head of Sales ', 'Brisbane, Queensland, Australia', 'https://www.linkedin.com/in/ACwAACEsgmoBJFXd1zL7suOs9Td00oCW_z7RLlA', 'connected', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Lisa Cunningham') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACEsgmoBJFXd1zL7suOs9Td00oCW_z7RLlA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recKXDK3H2n3tujFw', 'Satory Li', 'Global Supply Chain Director', 'Sydney, Australia', 'https://www.linkedin.com/in/satory-li-541366102', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Satory Li') OR linkedin_url = 'https://www.linkedin.com/in/satory-li-541366102'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recKwQCjwa57vIBzg', 'Brett Watkins', 'National Sales Manager', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAABgHb0UBzXDeyst7xQ6poDGpQP2mJfScVkU', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Brett Watkins') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABgHb0UBzXDeyst7xQ6poDGpQP2mJfScVkU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recLI9BRe2jyKSfRD', 'Matt Crowe', 'Head of Sales and Strategy', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAAA4aNgBgYkull3pYL9O6bhSXxZNTmDLa3g', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Matt Crowe') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAA4aNgBgYkull3pYL9O6bhSXxZNTmDLa3g'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recLUnkkq22SdrpD9', 'Trent Lowe', 'Sales Director (Master Agent - CBA)', 'Brisbane City, Queensland, Australia', 'https://www.linkedin.com/in/ACwAAAZOFqQBjMdrP0Rd-ZO8LC6gsDjnpFRwa00', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Trent Lowe') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAZOFqQBjMdrP0Rd-ZO8LC6gsDjnpFRwa00'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recLVZQHsrmUoUQYt', 'Darren E.', 'General Manager - Sales', 'Greater Melbourne Area, Australia', 'https://www.linkedin.com/in/ACwAAAA9elABVoAqs8vN9lYLcwRS5chWg22MqwU', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Darren E.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAA9elABVoAqs8vN9lYLcwRS5chWg22MqwU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recLYm4H6HdkSe0WY', 'Byron Rudenno', 'Senior Vice President, Europe & Asia-Pacific', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAABJOhgBMxDrdpWxAv5izPepCIiU_Fs7K_8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Byron Rudenno') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABJOhgBMxDrdpWxAv5izPepCIiU_Fs7K_8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recLrYuJMmjQhS0ig', 'Jerry Sun', 'Sales Director', 'Singapore, Singapore', 'https://www.linkedin.com/in/jerry-sun-259b63105', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jerry Sun') OR linkedin_url = 'https://www.linkedin.com/in/jerry-sun-259b63105'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recM1gtgUGa8R28gf', 'Belma Kubur', 'Head of Consultancy - New & Strategic Accounts', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAxESIkBnOObybM8n6bjYULDM1Wb2Pd22dE', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Belma Kubur') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAxESIkBnOObybM8n6bjYULDM1Wb2Pd22dE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recM5hhRdhRrU6x6s', 'Damian Wrigley', 'Senior Sales Manager Australia, JustCo', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAALBzWoBh0bvRZ3l3aNQ-nM5VdzBqiEMYeA', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Damian Wrigley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAALBzWoBh0bvRZ3l3aNQ-nM5VdzBqiEMYeA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recMSnynlGE9Tdmod', 'Shane Verner', 'A/NZ Sales Director', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAABt_AEBAUJbfkEeMtZK7xoPleWzukA84kM', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Shane Verner') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABt_AEBAUJbfkEeMtZK7xoPleWzukA84kM'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recMXk401GmZQWOqb', 'Clare Stokes', 'Manager, Sales Development APJ', 'Sydney, Australia', 'https://www.linkedin.com/in/stokesclare', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Clare Stokes') OR linkedin_url = 'https://www.linkedin.com/in/stokesclare'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recMb6EA7q2mfloVL', 'Kelly Johnson', 'ANZ Regional Sales Manager', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAAFSywB9AF90efV2fuZS2bBJ_HsjVzapyY', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Kelly Johnson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAFSywB9AF90efV2fuZS2bBJ_HsjVzapyY'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recMgAXb1t3I7yEpz', 'Jason Leonidas', 'Regional Director, ANZ & South Asia ', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAABZDCMBts13j7W8PeHy0CIpHCNn5elQFaw', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jason Leonidas') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABZDCMBts13j7W8PeHy0CIpHCNn5elQFaw'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recMh2ubzslvPKiPh', 'Dave Illman', 'Regional Sales Manager - ANZ', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAAAAkvKgBaMtznMOdYeE8BDEO8g1egFkXTNg', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Dave Illman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAkvKgBaMtznMOdYeE8BDEO8g1egFkXTNg'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recMnJZ3ce1OoFnCx', 'Ed Layton', 'Head of Strategic Engagements Amazon Project Kuiper', 'Queenscliff, Australia', 'https://www.linkedin.com/in/ed-layton-27a886a', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ed Layton') OR linkedin_url = 'https://www.linkedin.com/in/ed-layton-27a886a'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recMqudA13nOZPdb9', 'Drew Plummer', 'Head of Sales, ANZ', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAABT3sRQBzDeovbX3dQCV7ypeVLMZG0k8jU8', 'lead_lost', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Drew Plummer') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABT3sRQBzDeovbX3dQCV7ypeVLMZG0k8jU8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recMsLL1I1tbDnutc', 'Christina Mastripolito', 'Customer Success Manager', 'Adelaide, South Australia, Australia', 'https://www.linkedin.com/in/ACwAAByqKmAB0kSSsdsLLVoSBOcQZfTMluVgnOo', 'connection_requested', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Christina Mastripolito') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAByqKmAB0kSSsdsLLVoSBOcQZfTMluVgnOo'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recMv8OvQtDdEFHBc', 'Rino Crescitelli', 'Sales Manager', 'Adelaide, Australia', 'https://www.linkedin.com/in/rino-crescitelli-03a07b72', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Rino Crescitelli') OR linkedin_url = 'https://www.linkedin.com/in/rino-crescitelli-03a07b72'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recNCL1WMsEbaQdI5', 'Brad Granger', 'Country Manager - Australia', 'Melbourne, Australia', 'https://www.linkedin.com/in/brad-granger', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Brad Granger') OR linkedin_url = 'https://www.linkedin.com/in/brad-granger'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recNW2SUgeipGLsSF', 'Gerald Tjan', 'APAC Commercial Director', 'Singapore, Singapore', 'https://www.linkedin.com/in/ACwAABKA4e4BDxT_Xi4jjYGexGnFn0ib2ovde84', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Gerald Tjan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABKA4e4BDxT_Xi4jjYGexGnFn0ib2ovde84'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recNY4MLjdShmAMIp', 'Peter Ferris', 'Vice President of Sales', 'Port Melbourne, Australia', 'https://www.linkedin.com/in/ACwAAAJ7u4gBy6mWFy5rAgFX6GJLhMEPIXuixsw', 'connected', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Peter Ferris') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAJ7u4gBy6mWFy5rAgFX6GJLhMEPIXuixsw'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recNcpMTL0A0xRAgA', 'David  Chin', 'Regional Sales Manager', 'Singapore', 'https://www.linkedin.com/in/ACwAAAnQlYcBl3v4LPAPiCUNdaNC2KIKvsEfsTU', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('David  Chin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAnQlYcBl3v4LPAPiCUNdaNC2KIKvsEfsTU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recNfAfvnJkWTtrC7', 'Alex Riley', 'Director - Enterprise', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAABz4LW8Bu1YPv2BIVLONjd_to4EkALcP31A', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Alex Riley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABz4LW8Bu1YPv2BIVLONjd_to4EkALcP31A'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recNjRuHmVh7cOkgK', 'Allie Mairs', 'Director of Sales Asia Pacific', 'Sydney, Australia', 'https://www.linkedin.com/in/allielue', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Allie Mairs') OR linkedin_url = 'https://www.linkedin.com/in/allielue'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recNnWbCqF8cpnBuU', 'Mark Allen', 'Senior Manager of Automation and Robotic Solutions', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAARg3V8BI7d2U6G3ojR7ZtHeNqqP5Ze8QbE', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Mark Allen') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAARg3V8BI7d2U6G3ojR7ZtHeNqqP5Ze8QbE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recNnXOA4P3EuFnc0', 'Phil Harris', 'Enterprise Account Executive - ANZ', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAAXpQHYBUIYfNu617DcAU5TXq2mxvytHwuA', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Phil Harris') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAXpQHYBUIYfNu617DcAU5TXq2mxvytHwuA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recNoe6lJ921Rlps6', 'Ankesh Chopra', 'Vice President APAC', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAAOC7oIBWZPlI-RdNm0J5l4tuXDpSP_onlg', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ankesh Chopra') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOC7oIBWZPlI-RdNm0J5l4tuXDpSP_onlg'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recNtXAxPmHRYjLFS', 'Chris Sharp', 'Senior Vice President Business Development', 'Brisbane City, Queensland, Australia', 'https://www.linkedin.com/in/ACwAAABBDdkB_SkNbaG77cj2ezLqZu1WwFaMITk', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Chris Sharp') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABBDdkB_SkNbaG77cj2ezLqZu1WwFaMITk'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recO8qXHvo5GH4BFt', 'Simon Hickson', 'Regional Sales Manager', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAArmqP8B9CJzz3P71JPu1MHEwr_5zYzxSQM', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Simon Hickson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAArmqP8B9CJzz3P71JPu1MHEwr_5zYzxSQM'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recOSGz78aiZDoTFW', 'Andrew Browne', 'Sales Manager, MSP', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAACODrt0B9dHaBUVWT_wmasxZV1Z2dbJyWQA', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Andrew Browne') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACODrt0B9dHaBUVWT_wmasxZV1Z2dbJyWQA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recOTy4d9oNCZOHiX', 'Francesca M.', 'Regional Vice President', 'Australia', 'https://www.linkedin.com/in/ACwAAAciFtYBNr4jws-GVg6DhS5yu9d2VSVxB1A', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Francesca M.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAciFtYBNr4jws-GVg6DhS5yu9d2VSVxB1A'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recOlDVQe1O0BVj0M', 'Emlyn Gavin', 'Head of Sales, ANZ', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAABA0BdEBOjlnr8yUMmZNOJg8TUTfAhRYSFY', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Emlyn Gavin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABA0BdEBOjlnr8yUMmZNOJg8TUTfAhRYSFY'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recOmQC6qHao1KlXw', 'Richard Ford', 'Regional Sales Director APAC', 'Melbourne, Australia', 'https://www.linkedin.com/in/ACwAAAC6F8ABJNTZy_TQ1GyavCFvWuLojnlx11I', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Richard Ford') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAC6F8ABJNTZy_TQ1GyavCFvWuLojnlx11I'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recPSWYRRbUh2sE83', 'Cameron McLean', 'National Sales Manager', 'Noble Park, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAEtunhoB-Tr9CmP6fxP5uhO7JhbN3-6uyfU', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Cameron McLean') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAEtunhoB-Tr9CmP6fxP5uhO7JhbN3-6uyfU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recPVUmb6KS9d6FWg', 'Damien McDade', 'VP Revenue APAC', 'Melbourne, Australia', 'https://www.linkedin.com/in/damien-mcdade-83b485375', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Damien McDade') OR linkedin_url = 'https://www.linkedin.com/in/damien-mcdade-83b485375'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recPbocNDRWzov5he', 'Stella Ramette', 'Director Customer Relations & Sales, South East Asia', 'Singapore', 'https://www.linkedin.com/in/ACwAAAXyqu0B0CJUPWCupyEprECOEG4C2ud5USg', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Stella Ramette') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAXyqu0B0CJUPWCupyEprECOEG4C2ud5USg'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recPdwewtvRIjIQ6T', 'Stefan Ellis', 'Senior Business Development Manager', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAARdBWMBtDKClRUttSAPcjdVpyK3eJmwsLM', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Stefan Ellis') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAARdBWMBtDKClRUttSAPcjdVpyK3eJmwsLM'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recPhd3PZlByZmWIX', 'David Hickey', 'Executive Director, ANZ', '', 'https://www.linkedin.com/in/ACwAAALXTBsBfgTRk7DI_wcShCZfWQpoIjE4BSs', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('David Hickey') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAALXTBsBfgTRk7DI_wcShCZfWQpoIjE4BSs'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recPjYT5TcmgJBgee', 'David Chapman', 'Vice President of Business Development, APAC', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAzGmOYBnH-p0M8MaqRqn3Urbzfm9K2GcCg', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('David Chapman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAzGmOYBnH-p0M8MaqRqn3Urbzfm9K2GcCg'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recPkOCgzJsSnfl6I', 'Tiffany Ong', 'Head of Microsoft Singapore', 'Singapore, Singapore', 'https://www.linkedin.com/in/ACwAAC-xkRUBefmpBmPEewE2wzIycV2STykoqvs', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Tiffany Ong') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAC-xkRUBefmpBmPEewE2wzIycV2STykoqvs'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recPkP3iUMobkwwc3', 'David Helleman', 'Regional Sales Manager', 'Pelican Waters, Queensland, Australia', 'https://www.linkedin.com/in/ACwAAAKaCvgB327GG3yyjVQL2FeuWKM2unL9MW8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('David Helleman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKaCvgB327GG3yyjVQL2FeuWKM2unL9MW8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recPqviwppD3bMyIv', 'Luke McCarthy', 'ANZ Director of Account Managers | Local Government and Housing | Civica APAC', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAJXC9MB_HN2OMXQxDFCk0u0SLG-_eghdUU', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Luke McCarthy') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAJXC9MB_HN2OMXQxDFCk0u0SLG-_eghdUU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recPrl9inZ1Glb0nJ', 'Jonathon McCauley', 'Sales Director - Overseas Revenue & Channel', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAABI7n6ABBU7ZtUaDgXXqKkZXyDL_2iHLqrI', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jonathon McCauley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABI7n6ABBU7ZtUaDgXXqKkZXyDL_2iHLqrI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recPsPgH8dtrMOvAH', 'Theo McPeake', 'Sales Director, ANZ', '', 'https://www.linkedin.com/in/ACwAABDf5kABvuQIkoh3JBPi4Wsgj_VWMd9RiQk', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Theo McPeake') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABDf5kABvuQIkoh3JBPi4Wsgj_VWMd9RiQk'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recPw0cbrwdMvBOBI', 'Martin Cerantonio', 'Senior Manager, Channel Sales and Alliances for APJ', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAACBWQ4BsBoCjhpihPpsaKPuJzXBf7u7opQ', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Martin Cerantonio') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACBWQ4BsBoCjhpihPpsaKPuJzXBf7u7opQ'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recQRKv6RJFbENhnS', 'Praba Krishnan', 'Field Sales Director, Western Australia & Asia', 'Greater Perth Area', 'https://www.linkedin.com/in/ACwAAADzZ_QBZgSFXXp38D2045XQcqQ9I56w1P0', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Praba Krishnan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADzZ_QBZgSFXXp38D2045XQcqQ9I56w1P0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recQYhqcHLbmbazYf', 'Bhavik Vashi', 'Managing Director, Asia Pacific & Middle East', 'Singapore', 'https://www.linkedin.com/in/ACwAAAtjo3ABodnUAb0M_AJJ6dItjjbIYtUN5F8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Bhavik Vashi') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAtjo3ABodnUAb0M_AJJ6dItjjbIYtUN5F8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recQfOI4QymR3rqyj', 'Colin Stapleton', 'Regional Sales Manager', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAARUC0BN-Z3aOd0BYZfffvwRNg2tZvutUg', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Colin Stapleton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAARUC0BN-Z3aOd0BYZfffvwRNg2tZvutUg'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recQlFBEc6g3VQTla', 'Aleks Kakasiouris', 'Manager - Sales Development, Australia & New Zealand', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAc7ZUcB_rICSouYWKqvrDgMAWRJyK6nc60', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Aleks Kakasiouris') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAc7ZUcB_rICSouYWKqvrDgMAWRJyK6nc60'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recQslYokcb6MkvuM', 'Stanley Chia', 'Sales Director', 'Melbourne, Australia', 'https://www.linkedin.com/in/stanleychia', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Stanley Chia') OR linkedin_url = 'https://www.linkedin.com/in/stanleychia'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recR17tEl7dE1entP', 'Basil Botoulas', 'Senior Vice President of Sales, APJI', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAABfbCsBoW2Bzka0GyR4nxYRSkPCzvyhI1g', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Basil Botoulas') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABfbCsBoW2Bzka0GyR4nxYRSkPCzvyhI1g'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recR2tbiEKWJq3dd0', 'Alex Nemeth', 'Country Manager, Australia & NZ', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAKzBZIB8mfThsIR4XMC6xBnC_Zf2o3Ka5E', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Alex Nemeth') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKzBZIB8mfThsIR4XMC6xBnC_Zf2o3Ka5E'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recR6BDFkX725gzwN', 'Paul Mitchinson', 'Director Growth & Partnerships APJ', 'Sydney, Australia', 'https://www.linkedin.com/in/paul-mitchinson-8a4a06129', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Paul Mitchinson') OR linkedin_url = 'https://www.linkedin.com/in/paul-mitchinson-8a4a06129'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recR8iqLtEZVjlc1V', 'Jason Ogg', 'Enterprise Sales Manager', 'Perth, Western Australia, Australia', 'https://www.linkedin.com/in/ACwAAAuayowBpHsQMxgUNYX7bw3e4UZbpfhq_DE', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jason Ogg') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAuayowBpHsQMxgUNYX7bw3e4UZbpfhq_DE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recR9WC8sutfWbi4o', 'Vinod Venugopal', 'Senior Regional Sales Director', 'Melbourne, Australia', 'https://www.linkedin.com/in/vinod-venugopal-72038512', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Vinod Venugopal') OR linkedin_url = 'https://www.linkedin.com/in/vinod-venugopal-72038512'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recRBJExkjmk8tQxi', 'Bridie Rees', 'Senior People Business Partner, APJ', 'Sydney, Australia', 'https://www.linkedin.com/in/bridierees', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Bridie Rees') OR linkedin_url = 'https://www.linkedin.com/in/bridierees'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recRHOa9593vDsWWv', 'Thomas Nguyen', 'Sales director', 'Redfern, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAF5SEpABBgPXE1tn0kxcv8PV2qx3AQlcVYw', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Thomas Nguyen') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAF5SEpABBgPXE1tn0kxcv8PV2qx3AQlcVYw'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recRT8mNUIo7USXXR', 'John Delbridge', 'National Sales Manager - Adaptalift Access Rentals', 'Greater Brisbane Area', 'https://www.linkedin.com/in/ACwAAAN4B1YB344JnhZ5c9G2WE4lYLzX6ILcAPM', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('John Delbridge') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAN4B1YB344JnhZ5c9G2WE4lYLzX6ILcAPM'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recRYwkvxIXzER0at', 'Ron Gounder', 'Chief Customer Officer', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAL66VMBzz4J9xphbUqG-QZzdiaYFvihk08', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ron Gounder') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAL66VMBzz4J9xphbUqG-QZzdiaYFvihk08'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recRmKP141sKW0u3W', 'Adam Duncan', 'General Manager of Sales', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAABIRrgMBeRq8C32gXuza-3DnpydClkc6kgI', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Adam Duncan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABIRrgMBeRq8C32gXuza-3DnpydClkc6kgI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recRygiNX8MCT1Ldz', 'Gary Zeng', 'Sr. Manager, Channel Sales | Partnerships, Alliances and Channel - APAC ', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAvsStkBrpcODglXSqC1jpHE7Z_QsvKCNHo', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Gary Zeng') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAvsStkBrpcODglXSqC1jpHE7Z_QsvKCNHo'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recSAqqPakctWG82e', 'Aidan McDonald', 'VP Sales, APAC', 'Singapore, Singapore', 'https://www.linkedin.com/in/ACwAAAtP-LQB2y4WMsUQ6IY4j4uY3issCqvL2QA', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Aidan McDonald') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAtP-LQB2y4WMsUQ6IY4j4uY3issCqvL2QA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recSNJnFxhTz2BH5F', 'Tim McDonnell - SVP Sales', 'SVP Sales AU/NZ', 'Australia', 'https://www.linkedin.com/in/ACwAAAG4k7wBi1m1-umvMJccP4o3Zl4sFOO21aM', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Tim McDonnell - SVP Sales') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAG4k7wBi1m1-umvMJccP4o3Zl4sFOO21aM'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recSeScFrr9sO0qqy', 'James Hayward', 'Regional Sales Director, ANZ', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAAFVz2oBlYf7WzWxpqZ8nxrAaXjzFfo-OzU', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('James Hayward') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFVz2oBlYf7WzWxpqZ8nxrAaXjzFfo-OzU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recSeWS3cXVkz7Jjp', 'Blair Hasforth', 'Sales Director - APJ', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAADWE7oB1FD64dzt9CaP8Mgmkzw2Yt1FjvQ', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Blair Hasforth') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADWE7oB1FD64dzt9CaP8Mgmkzw2Yt1FjvQ'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recSprmCXhYxtzBqN', 'Charlie Pennington', 'Head of Sales & GTM | Cap Tables & PE | APAC & MENA', 'Singapore', 'https://www.linkedin.com/in/ACwAAAZfnxoBbtSFoNGub--1Onpu97IEnac1TF8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Charlie Pennington') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAZfnxoBbtSFoNGub--1Onpu97IEnac1TF8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recSq4OnWz9d1o4J8', 'Richard Exley', 'Vice President', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAkYxXMB1Zhtw85yzw5Dk-3D0NxL9MuEgyk', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Richard Exley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAkYxXMB1Zhtw85yzw5Dk-3D0NxL9MuEgyk'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recT0VOYPWVuGqUw5', 'Kyle Baker', 'Supplier Sales Manager', 'Greensborough, Australia', 'https://www.linkedin.com/in/kyle-thomas-baker', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Kyle Baker') OR linkedin_url = 'https://www.linkedin.com/in/kyle-thomas-baker'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recTEZZD0NEh89ZJz', 'Abhishek Nigam', 'Country Sales Manager', 'Singapore', 'https://www.linkedin.com/in/ACwAAAIfh94BHkk8hLf3tbr6NUYHp0kXiYJk53E', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Abhishek Nigam') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAIfh94BHkk8hLf3tbr6NUYHp0kXiYJk53E'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recTEaeGQAQdFajEx', 'Melissa Kiew', 'Strategic Sales Manager - SG, MY, PH', 'Singapore, Singapore', 'https://www.linkedin.com/in/melissakiew', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Melissa Kiew') OR linkedin_url = 'https://www.linkedin.com/in/melissakiew'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recTKXlOXwImV7ZnV', 'Mark Gosney', 'Sales Director, Australia & New Zealand', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAACNIHEYBcuR9nj0mOxmHSGEOu2hCK6084W0', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Mark Gosney') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACNIHEYBcuR9nj0mOxmHSGEOu2hCK6084W0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recTMuCDsidOkGJj7', 'Kenneth Yeo', 'Team Lead - APAC', 'Sydney, Australia', 'https://www.linkedin.com/in/kennethyeoideas', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Kenneth Yeo') OR linkedin_url = 'https://www.linkedin.com/in/kennethyeoideas'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recTXESaNl5pQJaHv', 'Kylie Terrell', 'Sales Director', 'Australia', 'https://www.linkedin.com/in/ACwAAAYnjxUByubGwx8my9yZnyg_OBR5ridC98Y', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Kylie Terrell') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAYnjxUByubGwx8my9yZnyg_OBR5ridC98Y'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recTaixdewDw9YJcT', 'Eunice Zhou', 'Regional Sales Manager', 'Singapore', 'https://www.linkedin.com/in/ACwAAArP78ABdnTtt4D89VKQKU1y4O_S5Z6eLk4', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Eunice Zhou') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAArP78ABdnTtt4D89VKQKU1y4O_S5Z6eLk4'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recTrlBWIIblCqFqv', 'Rj Price', 'Director, Field Sales', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAAEZNsoBONZoaTMWdtCIGAEfsz3vZZkfH3M', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Rj Price') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEZNsoBONZoaTMWdtCIGAEfsz3vZZkfH3M'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recTt5zewH8rolff3', 'Sean Walsh', 'Regional Director', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAAAYS8YBMkbqMtS4ixw10qimlev-rNnsb7c', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Sean Walsh') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAYS8YBMkbqMtS4ixw10qimlev-rNnsb7c'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recTxhXKXdBYpbxuw', 'Jo Gaines', 'Head of Channel APJ', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAABJiAUBly92h53-BiBUxcXFJMoMSvNa15Y', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jo Gaines') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABJiAUBly92h53-BiBUxcXFJMoMSvNa15Y'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recU1KSmEEknWSDX1', 'Houman Sahraei', 'Regional Partner Manager', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAAVJz1cBS6pbRJJ9c3IOCA0lKSZ5e3AFEZI', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Houman Sahraei') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAVJz1cBS6pbRJJ9c3IOCA0lKSZ5e3AFEZI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recU5tQ3owKu5VZgN', 'Nicole Russo', 'VP Commercial Operations', 'Greater Adelaide Area, Australia', 'https://www.linkedin.com/in/ACwAAAEX0ygB1kHkM8_FGZdQLzx3fvf8OPgOQt8', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Nicole Russo') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEX0ygB1kHkM8_FGZdQLzx3fvf8OPgOQt8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recU9C98pNnTG3he0', 'Marc AIRO-FARULLA', 'APAC Sales Vice President - Digital Security Solutions', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAARD2gcBeM9MU-k8mh27GWW8OGtwa37QKYE', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Marc AIRO-FARULLA') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAARD2gcBeM9MU-k8mh27GWW8OGtwa37QKYE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recU9epPzC3BPCyFL', 'Darren Bowie', 'Senior Business Development Manager', 'Brisbane, Queensland, Australia', 'https://www.linkedin.com/in/ACwAAB54KokB8IDOPpN99aoyKTufZ4xqMVWTYmU', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Darren Bowie') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAB54KokB8IDOPpN99aoyKTufZ4xqMVWTYmU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recUBQeie6NqioUwY', 'Terence T.', 'Enterprise Sales Lead - APAC', 'Singapore', 'https://www.linkedin.com/in/ACwAABKiCb4BprKIrAdvTq6hryWeYhz0_o3zUGA', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Terence T.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABKiCb4BprKIrAdvTq6hryWeYhz0_o3zUGA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recULu6090SCPVCup', 'Jeff Yeoh', 'Director, Sales Development Asia Pacific & Japan', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAOu-CYBdGLDEgENcsaRq0r0DtK-jN_B40g', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jeff Yeoh') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOu-CYBdGLDEgENcsaRq0r0DtK-jN_B40g'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recUgjRpSWe3LJxdi', 'Gary Saw', 'Vice President, APAC', 'Singapore', 'https://www.linkedin.com/in/ACwAAAJNVu8BJVwDvyZiFcbEFviME0Jd_G_niVA', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Gary Saw') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAJNVu8BJVwDvyZiFcbEFviME0Jd_G_niVA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recUn204rEUlRJCuV', 'Kevin Rawlings', 'Chief Revenue Officer', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAABpiT_cB0dsrxE6ZJKaVjoF_u7710jm2v7o', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Kevin Rawlings') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABpiT_cB0dsrxE6ZJKaVjoF_u7710jm2v7o'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recUoGB2snfBCFxsN', 'John Aguilar', 'Enterprise Account Director', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAabEGwBUGUzwkySMSk0et_bdm33b9jvuAo', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('John Aguilar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAabEGwBUGUzwkySMSk0et_bdm33b9jvuAo'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recUqx3fw3CSXDmI5', 'Kris H.', 'Senior Vice President ANZ', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAACf8LQBA2vs4yBy8Q-YopQav7uHzRVLsg0', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Kris H.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACf8LQBA2vs4yBy8Q-YopQav7uHzRVLsg0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recV43UMRTfyNLHxs', 'Kayur Desai (KD)', 'General Manager, Supplier', 'Sydney, Australia', 'https://www.linkedin.com/in/kayur-desai-kd', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Kayur Desai (KD)') OR linkedin_url = 'https://www.linkedin.com/in/kayur-desai-kd'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recV5UeBE3v0UfAAx', 'Olivia Willee', 'Partner, Technology Consulting', 'Melbourne, Australia', 'https://www.linkedin.com/in/oliviawillee', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Olivia Willee') OR linkedin_url = 'https://www.linkedin.com/in/oliviawillee'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recVVqQA04bA8foFo', 'Grant Eggleton', 'SVP Operational Intelligence, R&D Technology', 'Melbourne, Australia', 'https://www.linkedin.com/in/grant-eggleton', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Grant Eggleton') OR linkedin_url = 'https://www.linkedin.com/in/grant-eggleton'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recVXG8vZWpkDtJEL', 'Darryn Cann', 'CCS Solution Success Director - APAC', 'Greater Melbourne Area, Australia', 'https://www.linkedin.com/in/ACwAAAdtpg0BuA5bPVZzGUxzgFz1yg0lahczae8', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Darryn Cann') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAdtpg0BuA5bPVZzGUxzgFz1yg0lahczae8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recVbIu3HXyxoTT4b', 'Simon Dougall', 'Regional Sales Manager, APAC', 'Australia', 'https://www.linkedin.com/in/simon-dougall-9a76022', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Simon Dougall') OR linkedin_url = 'https://www.linkedin.com/in/simon-dougall-9a76022'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recVdMywHW3xi8QJC', 'Russell Palmer', 'Managing Director', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAACtfA0Bi_LljWCaTSXo3h9IOC1I6JjhOQ4', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Russell Palmer') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACtfA0Bi_LljWCaTSXo3h9IOC1I6JjhOQ4'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recVeYbWO7aiqnyA4', 'Rebecca Tissington', 'Head of Strategic Growth', 'Manly, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAA2DDFoBRAQ4FgVX8bmtNWBI51O2-HJkAwM', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Rebecca Tissington') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA2DDFoBRAQ4FgVX8bmtNWBI51O2-HJkAwM'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recVhkOS6mdaMmqwv', 'Marcel Pitt', 'Enterprise Account Director', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAABL5jkBcw2_leSGFicYww-jrL0zNHZ15yY', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Marcel Pitt') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABL5jkBcw2_leSGFicYww-jrL0zNHZ15yY'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recVuTTPMjre0pdzP', 'Andrew Amos', 'Regional Vice President, Sales', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAhmFyEBxNGGcz8NYgANX3_Zl7W176_MEzE', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Andrew Amos') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAhmFyEBxNGGcz8NYgANX3_Zl7W176_MEzE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recW5EEcEPejLQr8U', 'Zeek Ahamed', 'Sales Director', 'Carlton, Victoria, Australia', 'https://www.linkedin.com/in/ACwAACbi_gMBw32I2uFNhXMH_4ry20bpfKnsFMw', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Zeek Ahamed') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACbi_gMBw32I2uFNhXMH_4ry20bpfKnsFMw'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recW8GWxVfjCXrLJz', 'Justin Kumar', 'Account Director - APAC', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAABcg8rYBv_-JsMsLfWAj1ey_38O-XFzMEro', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Justin Kumar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABcg8rYBv_-JsMsLfWAj1ey_38O-XFzMEro'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recWbkmCZPSbZLzcW', 'Matthias Hauser', 'Regional Sales Director APAC', 'New Port, South Australia, Australia', 'https://www.linkedin.com/in/ACwAAAe4FegBoXgyPa40RNaX3DoVTnl68MrMcgI', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Matthias Hauser') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAe4FegBoXgyPa40RNaX3DoVTnl68MrMcgI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recWrWT9sjmfy72Xr', 'Mick Brennan', 'Territory Manager NSW/ACT', 'Sydney, Australia', 'https://www.linkedin.com/in/mick-brennan-5694b63a', 'new', 'Medium', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Mick Brennan') OR linkedin_url = 'https://www.linkedin.com/in/mick-brennan-5694b63a'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recWuuzxyqJ9dmUzs', 'Craig Moulin', 'General Manager', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAA1k0soBc-cSa1UpfM6XE7mo7JV3v15so7k', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Craig Moulin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA1k0soBc-cSa1UpfM6XE7mo7JV3v15so7k'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recX6KaZhX8iULgTE', 'David Knapp', 'Regional Sales Manager', 'Greater Brisbane Area', 'https://www.linkedin.com/in/ACwAAAe2JNkB2vv_Bt6sdOqHIkwnTBgZ_LFzb4U', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('David Knapp') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAe2JNkB2vv_Bt6sdOqHIkwnTBgZ_LFzb4U'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recX9UXlMexJJG5vn', 'Craig Medlyn', 'Regional Director, APAC', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAAAciz48BT5_FJpB_thV1vmKo7APTHb6BQb0', 'new', 'High', '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Craig Medlyn') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAciz48BT5_FJpB_thV1vmKo7APTHb6BQb0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recXLlPst3eiT9anW', 'Ian Berkery', 'Regional Sales Director', 'Millers Point, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAHUvyUBu9nKhYs1XURqQZ5ev--qSBKMKDA', 'connected', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ian Berkery') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAHUvyUBu9nKhYs1XURqQZ5ev--qSBKMKDA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recXLpE9zwrEMHXGW', 'Keith Chan', 'Head of APAC Partnerships', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAzTTocB58LARl1bZUouDzhX5UYmdDxlSF0', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Keith Chan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAzTTocB58LARl1bZUouDzhX5UYmdDxlSF0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recXNH4JVf6DjTdaj', 'Coreen Chia', 'Sales Manager', 'Singapore, Singapore', 'https://www.linkedin.com/in/coreen-chia', 'connected', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Coreen Chia') OR linkedin_url = 'https://www.linkedin.com/in/coreen-chia'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recXOkfm1HFZLxhMN', 'Tim Clark', 'Partner, Growth', 'Sydney, Australia', 'https://www.linkedin.com/in/timcwclark', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Tim Clark') OR linkedin_url = 'https://www.linkedin.com/in/timcwclark'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recXUSd7NR8uN6n4H', 'Soumi Mukherjee', 'Sales Director Australia & New Zealand ', 'Greater Brisbane Area, Australia', 'https://www.linkedin.com/in/ACwAAACsja8By4ORabsg6shBgP8MFUfy8eebGLc', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Soumi Mukherjee') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACsja8By4ORabsg6shBgP8MFUfy8eebGLc'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recXf9kd6aBO3x4FX', 'Cassandra Crothers', 'Head of Sales APAC', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAADQ8dgBpVRcP-OvbKHXOHe7LwynZ4Z0sUI', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Cassandra Crothers') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADQ8dgBpVRcP-OvbKHXOHe7LwynZ4Z0sUI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recXlBKOiFHrLSuz1', 'Belinda Glasson', 'Recruitment Team Lead - Asia Pacific', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAw0QZIBIA60RcTFRK19Yh350fbfSwD2pyM', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Belinda Glasson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAw0QZIBIA60RcTFRK19Yh350fbfSwD2pyM'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recXvOuzd0xPTUEVL', 'Sean Phelps', 'General Manager, Oceania', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAA4KLGcBrsrSzy_0JizR97Rjzgvy1HgSjgA', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Sean Phelps') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA4KLGcBrsrSzy_0JizR97Rjzgvy1HgSjgA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recYGyqZR43A8WKgJ', 'Eralp Kubilay', 'Country Manager ANZ Regional Sales', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAAChthMBNtL0BJPUbfTHSi-ie9wRUHTDP-U', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Eralp Kubilay') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAChthMBNtL0BJPUbfTHSi-ie9wRUHTDP-U'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recYHQb17gkuB0sIT', 'Jit Shen T.', 'Sr Channel Sales Manager, APAC', 'Singapore, Singapore', 'https://www.linkedin.com/in/ACwAABLVM1sBuS2_86jcEOluVckAbOeEWHwS1gU', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jit Shen T.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABLVM1sBuS2_86jcEOluVckAbOeEWHwS1gU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recYfvBTpryqxpvvL', 'Celeste Kirby-Brown', 'Executive General Manager, APAC', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAAADiwXQBtDeYUuD-u_jadJSOuzE5tnvE7bY', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Celeste Kirby-Brown') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADiwXQBtDeYUuD-u_jadJSOuzE5tnvE7bY'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recYg9b3NpH3tjdGq', 'Praveen Kumar Chandrashekhar', 'Vice President Sales, Asia Pacific & ME', 'Singapore', 'https://www.linkedin.com/in/ACwAAACNvfsBOp-ItPhreLBIJjhX6b6M2Tqou-E', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Praveen Kumar Chandrashekhar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACNvfsBOp-ItPhreLBIJjhX6b6M2Tqou-E'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recYmsyJwPhM5Qu3e', 'Louisa Jewitt', 'Head of Sales, Australia', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAACQbwOMBoWbnPVjgbxt-hRBlKmUIWLYAXcs', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Louisa Jewitt') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACQbwOMBoWbnPVjgbxt-hRBlKmUIWLYAXcs'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recZC4LfGf840xm6C', 'Kimberley Duggan', 'Regional Vice President - Enterprise', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAABTVeoABlBO1Y3YxmZA24Q8GoowpRJlA9v8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Kimberley Duggan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABTVeoABlBO1Y3YxmZA24Q8GoowpRJlA9v8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recZi1Lvur1rcqgWw', 'Frankco Shum', 'Senior Channel Sales Manager', 'Singapore', 'https://www.linkedin.com/in/ACwAAACtHbkBv-zQqzKwpDj6fpEuAPXVSSIwDdA', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Frankco Shum') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACtHbkBv-zQqzKwpDj6fpEuAPXVSSIwDdA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recZpi0f25tPPv5nH', 'Krina K.', 'Sales Team Leader APAC', 'Singapore', 'https://www.linkedin.com/in/ACwAAAY-Vx8Bb5WtsXWOISxXGCfwKa6c_z9-dhs', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Krina K.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAY-Vx8Bb5WtsXWOISxXGCfwKa6c_z9-dhs'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recZyUhykweSrhxnP', 'Nick Best', 'Sales Director ANZ', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAHYWMUBvblW_kEbEOPYgbcw69SPLXJYE_Q', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Nick Best') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAHYWMUBvblW_kEbEOPYgbcw69SPLXJYE_Q'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recaAtU4MxY5lPqB6', 'Nick Lowther', 'Regional Sales Manager', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAAwGVTwBO3SBJspgxl-5ys3aGXFSn8he8Cs', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Nick Lowther') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAwGVTwBO3SBJspgxl-5ys3aGXFSn8he8Cs'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recaVNbK03ht8wB1H', 'ZHIWEI JIANG', 'Sales Director', 'Sydney, Australia', 'https://www.linkedin.com/in/zhiwei-jiang-9678ab244', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('ZHIWEI JIANG') OR linkedin_url = 'https://www.linkedin.com/in/zhiwei-jiang-9678ab244'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recageLFsb0L5PXDP', 'Ben Pascoe', 'Sales Director - Australia and New Zealand', 'Australia', 'https://www.linkedin.com/in/ACwAAABfRVUB4K3FRVVwlj1eQJgg2WTXX2EkLCg', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ben Pascoe') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABfRVUB4K3FRVVwlj1eQJgg2WTXX2EkLCg'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recazyXG9KNEG7d5Q', 'Lilli Perkin', 'Senior Client Services Manager', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAgHrXoBL-Qr4418pjds6rhdTyu96JGNW7s', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Lilli Perkin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAgHrXoBL-Qr4418pjds6rhdTyu96JGNW7s'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recb2IKPsuNv6BxsY', 'Ellie G.', 'Manager, Sales - Australia', 'Australia', 'https://www.linkedin.com/in/ACwAABO51BoBwZPu4oeeTWgTejUsaIMmwAOysc4', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ellie G.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABO51BoBwZPu4oeeTWgTejUsaIMmwAOysc4'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recb5fr05C9GwY1m1', 'Darren Ward', 'Director of Strategic Enterprise & Government ', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAYOMIYBa-fPMsySKdf7d6NxPVZr5O-2i9g', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Darren Ward') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAYOMIYBa-fPMsySKdf7d6NxPVZr5O-2i9g'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recb7PiXiU28QVGFm', 'Sally Matheson', 'Executive Search Recruiter', 'Sydney, Australia', 'https://www.linkedin.com/in/sally-matheson-0ba9b41', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Sally Matheson') OR linkedin_url = 'https://www.linkedin.com/in/sally-matheson-0ba9b41'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recb7WOwJEWYvf8cB', 'Gerry Tucker', 'Director of Sales Large Entreprise', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAAcVxwBS4-YdSokPHeD0VxUL4frMzW-GCQ', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Gerry Tucker') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAcVxwBS4-YdSokPHeD0VxUL4frMzW-GCQ'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recb9z4p24spoAYF0', 'Jeannine Winiata', 'New Business Sales Director', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAADjOGgBouLsUSM5EpH3OTeUacS34o7L47A', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jeannine Winiata') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADjOGgBouLsUSM5EpH3OTeUacS34o7L47A'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recbG8xZw0zaD1CDp', 'Mark Coughlan', 'VP Sales - APAC', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAcWH-4BxLjUyIOP3IPE5m8rplvgZrWQJUU', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Mark Coughlan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAcWH-4BxLjUyIOP3IPE5m8rplvgZrWQJUU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recbO7wpxaiZGhb7x', 'Shane Ullman', 'Associate Manager, Sales Development APAC', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAp97e4BXmJ0t8elSzfIHEmw7D7Q1yYLenY', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Shane Ullman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAp97e4BXmJ0t8elSzfIHEmw7D7Q1yYLenY'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recbRmC5NLtPLM714', 'Scott Bocksette', 'National Sales Manager', 'Bonbeach, Victoria, Australia', 'https://www.linkedin.com/in/ACwAACiGdtwBPGmT_f_19CzXT_Jgtw4EtiW5g98', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Scott Bocksette') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACiGdtwBPGmT_f_19CzXT_Jgtw4EtiW5g98'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recbay8x0sFgO75ia', 'James Jeffson', 'Sales Manager', 'Homebush, Australia', 'https://www.linkedin.com/in/james-jeffson-715774317', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('James Jeffson') OR linkedin_url = 'https://www.linkedin.com/in/james-jeffson-715774317'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recbcwXMuPfFhupxL', 'Ash Gibbs', 'Director Of Operations', 'Greater Melbourne Area, Australia', 'https://www.linkedin.com/in/ACwAAABXU7gBFiOagMxMNU4okFLvMrKtTwYAjFU', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ash Gibbs') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABXU7gBFiOagMxMNU4okFLvMrKtTwYAjFU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recbiibX6zqm7G4Bc', 'Mamoon Huda', 'Principal Project Manager (Director, Professional Services)', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAADX1osBXQrG223XEaODsf8lLxxGAbqQebU', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Mamoon Huda') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADX1osBXQrG223XEaODsf8lLxxGAbqQebU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recboXR03VUOJD8An', 'Andrew Rae', 'Head of SMB and Channel', 'Bendigo, Australia', 'https://www.linkedin.com/in/andyrae', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Andrew Rae') OR linkedin_url = 'https://www.linkedin.com/in/andyrae'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recbsysZbBHKUE3FU', 'Mzi Mpande', 'Sales Manager - Jobs', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAACmHa5ABMaPCLNVVrHgGg5hh2nvvfFf7Fc0', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Mzi Mpande') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACmHa5ABMaPCLNVVrHgGg5hh2nvvfFf7Fc0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recbu6mhnGMEe1774', 'Michael Small', 'Head of Growth, APAC', 'Sydney, Australia', 'https://www.linkedin.com/in/smallmike', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Michael Small') OR linkedin_url = 'https://www.linkedin.com/in/smallmike'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recbzJiGjxMFIbqoR', 'Lahif Yalda', 'Channel Sales Director', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAAIQhfwBoW60ZiXYOgw9Zu1zd_-LFgwvqos', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Lahif Yalda') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAIQhfwBoW60ZiXYOgw9Zu1zd_-LFgwvqos'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recc4aVp6uEUW7QA7', 'Declan Keir-Saks', 'Senior Sales Manager at Square', 'Melbourne, Australia', 'https://www.linkedin.com/in/declankeirsaks', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Declan Keir-Saks') OR linkedin_url = 'https://www.linkedin.com/in/declankeirsaks'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recc4ha5ShE9mR21c', 'Allie B.', 'Director of Go To Market - SMB | Oceania', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAn2HIIBFWR7I08997kWFIpt9xGz6dWKb-M', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Allie B.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAn2HIIBFWR7I08997kWFIpt9xGz6dWKb-M'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recc9Ou0EBKyldwUG', 'Jeremy Pell', 'Country Manager AVP', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAADJxGoBSH1Bf2LOXTCEWoFrCoqFPDuophg', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jeremy Pell') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADJxGoBSH1Bf2LOXTCEWoFrCoqFPDuophg'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reccBCYYsNHwwSegp', 'Damian Trubiano', 'Industrial IoT Sales Manager Australia', 'Melbourne, Australia', 'https://www.linkedin.com/in/damiantrubiano', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Damian Trubiano') OR linkedin_url = 'https://www.linkedin.com/in/damiantrubiano'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reccQGZbayt51GyiT', 'Mandy Gallie', 'Vice President, Mastercard, Loyalty Sales Asia Pacific', 'St Leonards, Australia', 'https://www.linkedin.com/in/mandy-gallie-3793871', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Mandy Gallie') OR linkedin_url = 'https://www.linkedin.com/in/mandy-gallie-3793871'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reccRG3MV4DHHrhG3', 'Andrew Walford', 'Senior Sales Manager', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAABkUAH0Bd4h_0bL9eGFTa8j0uyf26NVR-mM', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Andrew Walford') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABkUAH0Bd4h_0bL9eGFTa8j0uyf26NVR-mM'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reccTaDY8ulymbfAI', 'Yamato Toda', 'Senior Outbound Business Representative', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAACZ5KN8BNggEI6yaoJSRWnVltBMtz66X6Ww', 'new', 'Low', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Yamato Toda') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACZ5KN8BNggEI6yaoJSRWnVltBMtz66X6Ww'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reccVJFihuNqN6JsP', 'Dajana Büchner', 'Revenue Operations Specialist', 'Brisbane City, Queensland, Australia', 'https://www.linkedin.com/in/ACwAAAVOgdIBou3mUNl4O8dGx3jkDbK0yaBwF64', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Dajana Büchner') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAVOgdIBou3mUNl4O8dGx3jkDbK0yaBwF64'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recd5JmI82hfAdoTk', 'Adrian Towsey', 'Vice President Commercial Sales APJ', 'Sydney, Australia', 'https://www.linkedin.com/in/adriantowsey', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Adrian Towsey') OR linkedin_url = 'https://www.linkedin.com/in/adriantowsey'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recdHWFt5h9Lu5Wka', 'Thomas Godfrey', 'Sales Account Executive', 'Brisbane, Queensland, Australia', 'https://www.linkedin.com/in/ACwAAAUSg8EBbwCVZnx3yT0i__4hEdkihB39VdQ', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Thomas Godfrey') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAUSg8EBbwCVZnx3yT0i__4hEdkihB39VdQ'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recdO13f3i2pR82uY', 'Andrew Cannington', 'GM (APAC) @ Cresta', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAABUKEEBsrsCK_RhU67OCn0UbFaOVbM1GJs', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Andrew Cannington') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABUKEEBsrsCK_RhU67OCn0UbFaOVbM1GJs'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recdTJKjBJwk9AFR6', 'Charlie Wood', 'Regional Sales Director - Asia', 'Singapore, Singapore', 'https://www.linkedin.com/in/ACwAABT_5uQBNnpxbPA4Xet_TUyTHylzO_gfRnQ', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Charlie Wood') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABT_5uQBNnpxbPA4Xet_TUyTHylzO_gfRnQ'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recdX0R1jygaSc8Fj', 'Julien Fouter', 'Vice President of Sales APAC', 'Sydney, Australia', 'https://www.linkedin.com/in/julien-fouter-8631a1', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Julien Fouter') OR linkedin_url = 'https://www.linkedin.com/in/julien-fouter-8631a1'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recdZJGS2OcWzGcsM', 'Dermot McCutcheon', 'Director Solutions Sales', 'Melbourne, Australia', 'https://www.linkedin.com/in/dermotmccutcheon', 'in queue', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Dermot McCutcheon') OR linkedin_url = 'https://www.linkedin.com/in/dermotmccutcheon'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recdZJPXwj3CNVi1b', 'Pascal Budd', 'Senior Key Accounts Manager, South East Asia', 'Sydney, Australia', 'https://www.linkedin.com/in/pascalbudd', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Pascal Budd') OR linkedin_url = 'https://www.linkedin.com/in/pascalbudd'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recdnmyN4W7en07cO', 'Florence Douyere', 'Country Manager, Australia and New Zealand', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAAAAxwV4BGnDPv0nScs9kRRTj9SJh1KhvquM', 'new', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Florence Douyere') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAxwV4BGnDPv0nScs9kRRTj9SJh1KhvquM'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recdwUoxasVJtKqG2', 'Will Hiebert', 'Regional Vice President, APJ', 'Australia', 'https://www.linkedin.com/in/ACwAAAKneMMBWXxgUwXv917SlLqPC20MZUbKi50', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Will Hiebert') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKneMMBWXxgUwXv917SlLqPC20MZUbKi50'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recdylH6Zt9yA9zVZ', 'Elizabeth Zab', 'Retail Sales Manager', 'Homebush, Australia', 'https://www.linkedin.com/in/elizabeth-zab-38ab2933b', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Elizabeth Zab') OR linkedin_url = 'https://www.linkedin.com/in/elizabeth-zab-38ab2933b'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recdzqyOZ9J0eOzfX', 'Grant S.', 'Enterprise Account Executive, APAC', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAU5XzsBcGcPRlx6Aa3hly90N7GL0DmV68c', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Grant S.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAU5XzsBcGcPRlx6Aa3hly90N7GL0DmV68c'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'receI8vaZ90meP1dp', 'Ben Chandra', 'Regional Sales Director - Australia, New Zealand and Indonesia ', 'Sydney, Australia', 'https://www.linkedin.com/in/ben-chandra', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ben Chandra') OR linkedin_url = 'https://www.linkedin.com/in/ben-chandra'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'receOnEBj8hfVrylp', 'James Harkin', 'APAC Senior Sales Director at Lucid', 'Sydney, Australia', 'https://www.linkedin.com/in/jamesbharkin', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('James Harkin') OR linkedin_url = 'https://www.linkedin.com/in/jamesbharkin'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'receR0hqVVTnpUNIf', 'Adam Furness, GAICD', 'Managing Director - APJ', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAGjvXwBK7N2PovSM8bhD4dgLzkrNer7-Nc', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Adam Furness, GAICD') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAGjvXwBK7N2PovSM8bhD4dgLzkrNer7-Nc'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'receYyczog7cgZ3Tq', 'Ethan Ng', 'Regional Executive - ANZ', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAADeS7cBS9x-vocWN56exG63lngBdgq5k8M', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ethan Ng') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADeS7cBS9x-vocWN56exG63lngBdgq5k8M'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recefL6OaIeILPSTk', 'Simon Laskaj', 'Regional Director - Australia & New Zealand', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAAOY3NYBpBZX4hi7-PMLfbz16nJB8MhWQMo', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Simon Laskaj') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOY3NYBpBZX4hi7-PMLfbz16nJB8MhWQMo'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recequhWOVaRcPtuQ', 'Carol Cao', 'Director, Sales Operations & Excellence – APAC', 'Singapore, Singapore', 'https://www.linkedin.com/in/ACwAAA3eC7oBNGIS54wsSTnXDchsIoyLaPnkTYE', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Carol Cao') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA3eC7oBNGIS54wsSTnXDchsIoyLaPnkTYE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'receqv65cNluFg5Uy', 'Cat Rutledge Jones', 'Australia/New Zealand Sales Leader', 'Sydney, Australia', 'https://www.linkedin.com/in/catrutledge', 'new', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Cat Rutledge Jones') OR linkedin_url = 'https://www.linkedin.com/in/catrutledge'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'receukE28AMV2hypI', 'James O''Sullivan', 'VP Sales, APAC', 'Canberra, Australian Capital Territory, Australia', 'https://www.linkedin.com/in/ACwAAAVQ7gMBejjqpaLiQyHMmK3zUKCB1Bu9KqU', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('James O''Sullivan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAVQ7gMBejjqpaLiQyHMmK3zUKCB1Bu9KqU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recewHOO4mLBZQp6o', 'Gregg McCallum', 'Regional Sales Director, APAC', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAAAruFlEBUTKgHjUMxpI7cirQGFrHtyPO-qw', 'replied', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Gregg McCallum') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAruFlEBUTKgHjUMxpI7cirQGFrHtyPO-qw'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recf7biGOGUvYfZQ3', 'Liying Lim', 'VP Sales, APAC', 'Singapore', 'https://www.linkedin.com/in/ACwAAABh21EB2dNZk_teWocn-L4NBnA7fdhqH5U', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Liying Lim') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABh21EB2dNZk_teWocn-L4NBnA7fdhqH5U'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recfAo1IMsMIYZ0AY', 'Alexander Falkingham', 'Regional Director - Enterprise & Public Sector JAPAC', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAACmx5sBboJvtS49Fq096ZB3GBBueVWUGeo', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Alexander Falkingham') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACmx5sBboJvtS49Fq096ZB3GBBueVWUGeo'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recfCv1I2GjfXj3hx', 'Rocco De Villiers', 'Director, Sales & Strategy', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAAYt9g4BB-n8arRZOg7MttjLi9-Lq1qtcuA', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Rocco De Villiers') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAYt9g4BB-n8arRZOg7MttjLi9-Lq1qtcuA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recfLQOwlNxz9dKKI', 'Tony Burnside', 'Senior Vice President APJ', 'Melbourne, Australia', 'https://www.linkedin.com/in/tonyburnside', 'in queue', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Tony Burnside') OR linkedin_url = 'https://www.linkedin.com/in/tonyburnside'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recfMGTqJiR7As3AN', 'Changjie Wang', 'Business Development Team Lead', 'Singapore, Singapore', 'https://www.linkedin.com/in/ACwAAEHLdzUByF5K99of1XX98Ic4t0XdbwkEfGY', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Changjie Wang') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAEHLdzUByF5K99of1XX98Ic4t0XdbwkEfGY'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recfPEIwjUm0oRUn2', 'Nick Martin', 'APAC GTM Lead', 'Lake Wendouree, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAAL1axYBFxbel42gegrgSf9BNx9L7d6hVl8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Nick Martin') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAL1axYBFxbel42gegrgSf9BNx9L7d6hVl8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recfSt6v2hRWBaA9V', 'Tony Fulcher', 'Senior Regional Director ANZ', 'Greater Brisbane Area', 'https://www.linkedin.com/in/ACwAAAMmzyUBvL6oCrJFnAl6TTR5-5PkZiaEq1w', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Tony Fulcher') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAMmzyUBvL6oCrJFnAl6TTR5-5PkZiaEq1w'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recfjUYvznZoGN7TM', 'Nick Randall', 'Regional Vice President Customer Growth - APAC', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAABbxuOsBKNvMc6GvjwNSJK-fMvNuymkmFaM', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Nick Randall') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABbxuOsBKNvMc6GvjwNSJK-fMvNuymkmFaM'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recfm7aRHC2MAYe6F', 'Danni Munro', 'Vice President Sales ANZ', 'Greater Brisbane Area', 'https://www.linkedin.com/in/ACwAAAKJMo0BgADw8c0GB9w34TtJ2caDbEvshh8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Danni Munro') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKJMo0BgADw8c0GB9w34TtJ2caDbEvshh8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recfr6lOOPmmiM3By', 'Elisabeth Lind', 'Assistant Sales Manager', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAC3lW5IBcBW5Elo7yDZ0xCwMbEkpJ4Tk0XE', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Elisabeth Lind') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAC3lW5IBcBW5Elo7yDZ0xCwMbEkpJ4Tk0XE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recfwpZ4CYV72gn6g', 'Sherryl M.', 'Client Consultant', 'Rushcutters Bay, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAALpfk0BkA3U5e0_7J5lpZ7VHA_z2K1d6TA', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Sherryl M.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAALpfk0BkA3U5e0_7J5lpZ7VHA_z2K1d6TA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recfyQI93I5q3XhJf', 'Tom Blackman', 'Managing Director, APAC & Japan', 'Singapore, Singapore', 'https://www.linkedin.com/in/ACwAAANquXcBehZxpK5zPKdh9QC9jVHCPpvwELg', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Tom Blackman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAANquXcBehZxpK5zPKdh9QC9jVHCPpvwELg'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recg2QyFYxj81bflc', 'Patrick Browne-Cooper', 'Sales Director ANZ', 'Australia', 'https://www.linkedin.com/in/ACwAAAMI41ABmpup5_hJWikzXGzP3mKA-UHg8Fs', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Patrick Browne-Cooper') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAMI41ABmpup5_hJWikzXGzP3mKA-UHg8Fs'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recgDrrtXzx3TiHq2', 'Karl Durrance', 'Managing Director, Australia and New Zealand', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAACuXnIBXbSC6bh0Dep2jzwVgttBijAjH3k', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Karl Durrance') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACuXnIBXbSC6bh0Dep2jzwVgttBijAjH3k'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recgRPalW4IyjJE0w', 'Byron Rudenno', 'Senior Vice President, Europe & Asia-Pacific', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAABJOhgBMxDrdpWxAv5izPepCIiU_Fs7K_8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Byron Rudenno') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABJOhgBMxDrdpWxAv5izPepCIiU_Fs7K_8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recgX28HvuMYc5yTR', 'Alex Gouramanis', 'HEAD OF SALES – NEW ZEALAND & AUSTRALIA, SOUTHERN', 'Melbourne, Australia', 'https://www.linkedin.com/in/alexgouramanis', 'new', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Alex Gouramanis') OR linkedin_url = 'https://www.linkedin.com/in/alexgouramanis'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recgacB7bLBWjVBaL', 'Rob Dooley', 'Vice President and General Manager, Asia Pacific and Japan', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAAABt-R8BUuDWf0oAmgRgwU5Lk-k0prtN7qI', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Rob Dooley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABt-R8BUuDWf0oAmgRgwU5Lk-k0prtN7qI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recggP5zMVNdTeBht', 'Reece Appleton', 'Regional Director APAC', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAAlXy-kBqk1aX_p0s-UMUsY7quPi-qHwpw8', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Reece Appleton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAlXy-kBqk1aX_p0s-UMUsY7quPi-qHwpw8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recgm0zj33aB6URYn', 'Zac Beeten', 'Sales Director - ANZ', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAg5D5UBKwntZbqjUFJpOxGmaTBzjWI14SQ', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Zac Beeten') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAg5D5UBKwntZbqjUFJpOxGmaTBzjWI14SQ'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recgo7oV9FeErHNWS', 'Alex Belperio', 'Executive General Manager - Central Sales', 'Canberra, Australian Capital Territory, Australia', 'https://www.linkedin.com/in/ACwAAARXVWwBQ_wPN3EdVkeIIDqb_2kiRGZ3sLU', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Alex Belperio') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAARXVWwBQ_wPN3EdVkeIIDqb_2kiRGZ3sLU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recgqASjS63A4ckfk', 'Evan Blennerhassett', 'Regional Sales Manager - Enterprise & Government', 'Brisbane, Queensland, Australia', 'https://www.linkedin.com/in/ACwAAABkkiABOgltupySzqicCjIJE3SvQCiNmSc', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Evan Blennerhassett') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABkkiABOgltupySzqicCjIJE3SvQCiNmSc'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recgy0rIz6pMjaG3M', 'Toni W.', 'Sales Director - CX', 'Australia', 'https://www.linkedin.com/in/ACwAACq66IkBHEcWBAzquJgCPhrrdQjOzg8M7-c', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Toni W.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACq66IkBHEcWBAzquJgCPhrrdQjOzg8M7-c'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rech9ZrQ1hsAYgOol', 'Franco Costa', 'Solution Sales Director - Audit & Risk - APAC', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAAPbIM0BOXJwaqZN9FoHwUTxsW8nukA6xyM', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Franco Costa') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAPbIM0BOXJwaqZN9FoHwUTxsW8nukA6xyM'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rechFJHyFnZLatbwH', 'Gavin Altus', 'Managing Director', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAAH2Ks8B9CVgTV3otuMOf6tzXgPFX73ZSj0', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Gavin Altus') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAH2Ks8B9CVgTV3otuMOf6tzXgPFX73ZSj0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rechKl6GBWUmp8BPM', 'Peter Gregson', 'Sales Manager', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAAmxmKQBXgzHQV-kkVFIlKBlgALPkShT2w4', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Peter Gregson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAmxmKQBXgzHQV-kkVFIlKBlgALPkShT2w4'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rechYvSzvc3ycpmjT', 'Gautam Ahuja', 'National Sales Director', 'Melbourne, Australia', 'https://www.linkedin.com/in/gautam-ahuja-226279292', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Gautam Ahuja') OR linkedin_url = 'https://www.linkedin.com/in/gautam-ahuja-226279292'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rechfkxIWm8kccy2q', 'Andrew McCarthy', 'GM of ANZ, SEA and India', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAP2OIEBhvmsGs4CE-6xJ22XbVoQB91JuM8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Andrew McCarthy') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAP2OIEBhvmsGs4CE-6xJ22XbVoQB91JuM8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recht35SReFcRf3bv', 'Prakash Damoo', 'Product Enablement Lead', 'Sydney, Australia', 'https://www.linkedin.com/in/prakashdamoo', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Prakash Damoo') OR linkedin_url = 'https://www.linkedin.com/in/prakashdamoo'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reciBwHcefXFR8rE6', 'Budd Ilic', 'Regional Director, ANZ', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAAABjY0oBt7rwWfdC54shwh0MlU23V7AeGCQ', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Budd Ilic') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABjY0oBt7rwWfdC54shwh0MlU23V7AeGCQ'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reciE84GTYcHNiV9O', 'Vicki Sayer', 'Professional Services Manager - Australia', 'Greater Melbourne Area, Australia', 'https://www.linkedin.com/in/ACwAABcJOxwBpkwe7JfLjG8x4qlzvC9VvA_w_Wc', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Vicki Sayer') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABcJOxwBpkwe7JfLjG8x4qlzvC9VvA_w_Wc'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recikzeGhhzDbcBuy', 'Martin Yan', 'Head of Enterprise Solutions Sales - APAC & Japan', 'Sydney, Australia', 'https://www.linkedin.com/in/martinyan', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Martin Yan') OR linkedin_url = 'https://www.linkedin.com/in/martinyan'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recim2nSBvZIkuQLf', 'Shaun Haque', 'Senior Sales Manager', 'Sydney, Australia', 'https://www.linkedin.com/in/shaunhaque', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Shaun Haque') OR linkedin_url = 'https://www.linkedin.com/in/shaunhaque'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recin5eSOv7uqcyOG', 'Vanessa Cause', 'Sales Director APAC', 'Brisbane, Queensland, Australia', 'https://www.linkedin.com/in/ACwAAAswnPEB6abP0DKP2dVhBTtQw6p64qbLQjw', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Vanessa Cause') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAswnPEB6abP0DKP2dVhBTtQw6p64qbLQjw'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recivA3sbUbbu8tON', 'Sam Symmans', 'Sales Director, ANZ', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAABtC2LYBxzEo8yr9HI-CVjcGL41YR5apCsU', 'in queue', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Sam Symmans') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABtC2LYBxzEo8yr9HI-CVjcGL41YR5apCsU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recixkHAC8cvSQXy0', 'Clint Elliott', 'Regional Sales Manager - Western Australia', 'Perth, Western Australia, Australia', 'https://www.linkedin.com/in/ACwAAATjWbIBcqRSeBGi4CTrVeLVt0wg7PSg0BI', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Clint Elliott') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATjWbIBcqRSeBGi4CTrVeLVt0wg7PSg0BI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reciy2Kv84AHdmjZa', 'Ryan Alexander', 'Head of Sales, Australia', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAFOtaMBTxx1xHv5t0vDvnKSDMC-V84fqGw', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ryan Alexander') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFOtaMBTxx1xHv5t0vDvnKSDMC-V84fqGw'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recizcGBMuqNpULyj', 'Penny Dolton', 'Pacific Sales Director - CostX', 'Brisbane, Queensland, Australia', 'https://www.linkedin.com/in/ACwAABQhvCMBfPI1DZKch-OWcdQdizG_PhnAfiY', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Penny Dolton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABQhvCMBfPI1DZKch-OWcdQdizG_PhnAfiY'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recj74ToRqf8ByLuI', 'Marco D. Castelán', 'Director - APAC Sales', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAAAlYnbYBeNCdo3-hfYch3V1Lm2GAfBy9NYE', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Marco D. Castelán') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAlYnbYBeNCdo3-hfYch3V1Lm2GAfBy9NYE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recjGNatiZBvN0Rpj', 'Julian Lock', 'Senior Sales Director - APAC', 'Greater Brisbane Area', 'https://www.linkedin.com/in/ACwAAAEwvkQBLlxtnjb21fPWmyLZs0tTGTTsEEc', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Julian Lock') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEwvkQBLlxtnjb21fPWmyLZs0tTGTTsEEc'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recjIsZ0dg1FWmaI2', 'Matthew Tyrrell', 'Sales Director, ANZ', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAAACxYdABEDFKVJ_3G6aUhQ9mdwGC1N1lLHM', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Matthew Tyrrell') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACxYdABEDFKVJ_3G6aUhQ9mdwGC1N1lLHM'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recjOkzIweR9qaiII', 'Luke Kavanagh', 'National Sales Manager', 'Australia', 'https://www.linkedin.com/in/ACwAABvENSEBSnBFLbw3LUBx-G1Xlp1u6Ewlfes', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Luke Kavanagh') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABvENSEBSnBFLbw3LUBx-G1Xlp1u6Ewlfes'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recjY4KLAMMr8HGFS', 'Jackson Duffy', 'Head of Partnerships', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAB-U4eEBYicTIC6uh0BFjw4pgqgZUHZ6esI', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jackson Duffy') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAB-U4eEBYicTIC6uh0BFjw4pgqgZUHZ6esI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recjZD38O6vAaz5Y2', 'Hayley Fisher', 'Adyen Country Manager - Australia & New Zealand', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAChh5IB6b2s_eEXnNb3VomBlbDxgWQ6k30', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Hayley Fisher') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAChh5IB6b2s_eEXnNb3VomBlbDxgWQ6k30'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recjZfpd7n63Bgw0I', 'Amanda Kidd', 'Sales Operations Manager', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAOTOs0B1__1QRYZTg9OvtyYx82Oshtxbh0', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Amanda Kidd') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOTOs0B1__1QRYZTg9OvtyYx82Oshtxbh0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recjpf1oZQVPxOotT', 'Alexander G.', 'General Manager', 'Greensborough, Australia', 'https://www.linkedin.com/in/alexanderjgreen', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Alexander G.') OR linkedin_url = 'https://www.linkedin.com/in/alexanderjgreen'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recjvnDJ55oJcRFvR', 'Luke Kavanagh', 'National Sales Manager', 'Australia', 'https://www.linkedin.com/in/ACwAABvENSEBSnBFLbw3LUBx-G1Xlp1u6Ewlfes', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Luke Kavanagh') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABvENSEBSnBFLbw3LUBx-G1Xlp1u6Ewlfes'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recjyWvxnGmGGTDu0', 'Simon Robinson', 'Growth & Operations', 'Sydney, Australia', 'https://www.linkedin.com/in/simonrobinson1974', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Simon Robinson') OR linkedin_url = 'https://www.linkedin.com/in/simonrobinson1974'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reck36OfCvKCGKHpo', 'Danielle Langley', 'Sales Manager', 'Greater Perth Area', 'https://www.linkedin.com/in/ACwAAAFTm9QBAEDhSFTBVl7GdgQvLFHmRqlx508', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Danielle Langley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFTm9QBAEDhSFTBVl7GdgQvLFHmRqlx508'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reckJX8bzwIfnfj1U', 'Damian Wrigley', 'Senior Sales Manager Australia, JustCo', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAALBzWoBh0bvRZ3l3aNQ-nM5VdzBqiEMYeA', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Damian Wrigley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAALBzWoBh0bvRZ3l3aNQ-nM5VdzBqiEMYeA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reckMAhhcEYfHkClb', 'Ashley Carron-Arthur', 'Enterprise Account Executive, APAC', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAW0bdgB9kKGArhyUcp9phFh9UEKcmZLPKE', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ashley Carron-Arthur') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAW0bdgB9kKGArhyUcp9phFh9UEKcmZLPKE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recktK08M6soM75dN', 'Allison Watts', 'Director of Sales - Workday Practice', 'Australia', 'https://www.linkedin.com/in/allisonwatts', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Allison Watts') OR linkedin_url = 'https://www.linkedin.com/in/allisonwatts'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reckud9kvrccGNCU1', 'Renee Rooney', 'Head of Customer Success', 'Gold Coast, Australia', 'https://www.linkedin.com/in/renee-rooney-67b779115', 'lead_lost', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Renee Rooney') OR linkedin_url = 'https://www.linkedin.com/in/renee-rooney-67b779115'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recl8hsdy1FFKNLsW', 'Anthony Read', 'Vice President Aerospace & Defence APJMEA', 'Melbourne, Australia', 'https://www.linkedin.com/in/anthony-read-a2a244133', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Anthony Read') OR linkedin_url = 'https://www.linkedin.com/in/anthony-read-a2a244133'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reclCcLVWujz8SLOW', 'Srikanth Mohan', 'Ecosystem Sales Director - Hybrid Integration and iPaaS for Australia & NZ market', 'Sydney, Australia', 'https://www.linkedin.com/in/srikanth-mohan-0bb5318', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Srikanth Mohan') OR linkedin_url = 'https://www.linkedin.com/in/srikanth-mohan-0bb5318'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reclI9ZXrkMVksTPl', 'Geoffrey Andrews', 'Sales Director - APAC', 'Sydney, Australia', 'https://www.linkedin.com/in/geoffreyandrews', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Geoffrey Andrews') OR linkedin_url = 'https://www.linkedin.com/in/geoffreyandrews'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reclJiss1NlzW0wP9', 'Michael Clarke', 'General Manager AU/NZ', 'Greater Brisbane Area', 'https://www.linkedin.com/in/ACwAAANeKMIBAghOM7EsWC2KHNpJuac7-LEj4iU', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Michael Clarke') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAANeKMIBAghOM7EsWC2KHNpJuac7-LEj4iU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reclKJn3g48XcTaXA', 'Elizabeth Watson', 'Chief Delivery Officer', 'Sydney, Australia', 'https://www.linkedin.com/in/elizabeth-watson-0817163', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Elizabeth Watson') OR linkedin_url = 'https://www.linkedin.com/in/elizabeth-watson-0817163'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reclMU0UyT2JMuEtc', 'Lawrence Du', 'SDR Manager | Simplifying IT Management | NinjaOne', 'Sydney, Australia', 'https://www.linkedin.com/in/lawrencedu', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Lawrence Du') OR linkedin_url = 'https://www.linkedin.com/in/lawrencedu'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recleGE0Fu1oEFrVU', 'Laura Lane', 'Head of Sales, ANZ', 'Singapore', 'https://www.linkedin.com/in/ACwAAA60TEUBtHEGo8MSRgRlqw4GER1hdQ6GDio', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Laura Lane') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA60TEUBtHEGo8MSRgRlqw4GER1hdQ6GDio'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reclfLlKEtVaxh7DO', 'Rayna K. McNamara', 'Senior Sales Manager', 'Queenscliff, Australia', 'https://www.linkedin.com/in/rkmcnamara', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Rayna K. McNamara') OR linkedin_url = 'https://www.linkedin.com/in/rkmcnamara'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reclgKGTLBH63pZx2', 'Johanes Iskandar', 'Regional Vice President of Sales', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAFsm_MB8ey7pT_xGIqT5m13Pmp-bQAxuz0', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Johanes Iskandar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFsm_MB8ey7pT_xGIqT5m13Pmp-bQAxuz0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recljpxKJLmaLtkQq', 'Charlotte Buxton', 'Enterprise Sales Manager', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAAtZsYgBHap28_PCkeYpoWUf5Cn2X9W7PlE', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Charlotte Buxton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAtZsYgBHap28_PCkeYpoWUf5Cn2X9W7PlE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reclmPIOukbHtwkf5', 'Steve Smith', 'Executive Director – Education (APAC)', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAE2xnwBHqukdddvJW7wTNR9yihRbJft-1o', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Steve Smith') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAE2xnwBHqukdddvJW7wTNR9yihRbJft-1o'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reclnuDGNYZXqPLQj', 'Avinash Kalyana Sundaram', 'Manager Client Success APAC', 'Australia', 'https://www.linkedin.com/in/avinashkalyanasundaram', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Avinash Kalyana Sundaram') OR linkedin_url = 'https://www.linkedin.com/in/avinashkalyanasundaram'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reclsqkVNYVsbdAEJ', 'Nathan Archie', 'GM US & ANZ', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAACt8skBOZUBu0dTQWpNwll9YGGfCJAxFQk', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Nathan Archie') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACt8skBOZUBu0dTQWpNwll9YGGfCJAxFQk'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reclvFVCbtiLEgbBN', 'Francis McGahan', 'Senior Business Development Manager', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAAmGghgBAi-x_YW7TBfbqQdhQXlDL-uqnuk', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Francis McGahan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAmGghgBAi-x_YW7TBfbqQdhQXlDL-uqnuk'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recm8YD3tBWLgsTdU', 'Whitney Liu', 'Sales Director - Pacific', 'Australia', 'https://www.linkedin.com/in/ACwAAAKWOWsBCR8GNYEhWDEIIoBWXoh-dIEWvq8', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Whitney Liu') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKWOWsBCR8GNYEhWDEIIoBWXoh-dIEWvq8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recmF5nGQLfdG4RXc', 'Anthony Harding', 'Head of Sales', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAALJM9EBwayAkUKsPSNP0Vf8S-g5a8kJ-Jo', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Anthony Harding') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAALJM9EBwayAkUKsPSNP0Vf8S-g5a8kJ-Jo'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recmGayu5dUZYTmVe', 'Lara Horne', 'Head of Sales', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAADPv2MBIHAKcCXc3fSFN9Yck-NJ6fpMVfc', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Lara Horne') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADPv2MBIHAKcCXc3fSFN9Yck-NJ6fpMVfc'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recmQzEqDP3gZhtZj', 'Paul Lancaster', 'Director Sales Engineering', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAGWWpABv7fX58S-LxILR12NxW5aH1_mBcQ', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Paul Lancaster') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAGWWpABv7fX58S-LxILR12NxW5aH1_mBcQ'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recn9wAQ9K8bZ6WSm', 'Amy Zhang', 'Head of APAC', 'Singapore', 'https://www.linkedin.com/in/ACwAAAYrHPsBGdLU3yWdbqidfTNveRScmdDx6YY', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Amy Zhang') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAYrHPsBGdLU3yWdbqidfTNveRScmdDx6YY'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recnPnJONpifitt13', 'Kristin Carville', 'Sales Director ANZ', 'Sydney, Australia', 'https://www.linkedin.com/in/kristin-carville-75b67439', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Kristin Carville') OR linkedin_url = 'https://www.linkedin.com/in/kristin-carville-75b67439'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recnVGTKtSM0aiZiI', 'Carlos Bravo', 'Head of Sales- ANZ', 'Melbourne, Australia', 'https://www.linkedin.com/in/1carlosbravo', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Carlos Bravo') OR linkedin_url = 'https://www.linkedin.com/in/1carlosbravo'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recngLCkjBMrNRpUN', 'Stephanie May', 'Merchant Success Manager', 'Ballina, Australia', 'https://www.linkedin.com/in/stephaniejmay', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Stephanie May') OR linkedin_url = 'https://www.linkedin.com/in/stephaniejmay'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recnhGB1PcBzGZVOc', 'Adam Maine', 'Regional Vice President - Australia & NZ', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAAAJwrrABLmGhjluE_TVDochkNzu69dgCrRw', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Adam Maine') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAJwrrABLmGhjluE_TVDochkNzu69dgCrRw'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recnjSBDdcSUaeRFY', 'Arran Mulvaney', 'Regional Director - ASEAN & India', 'Singapore, Singapore', 'https://www.linkedin.com/in/ACwAAA1tgBYBgCPCkhWuHwV7M6hQa9nArWkksa0', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Arran Mulvaney') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA1tgBYBgCPCkhWuHwV7M6hQa9nArWkksa0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recns3yCbnYa9osEQ', 'Steve Bray', 'Vice President - Australia & New Zealand', 'Greater Melbourne Area, Australia', 'https://www.linkedin.com/in/ACwAAAHP9jQB2bkW1oHFixi1wXIgO1dESQBnKms', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Steve Bray') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAHP9jQB2bkW1oHFixi1wXIgO1dESQBnKms'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reco0fBm5GNOyl9RS', 'Jacob Sinnott', 'Australia Sales Manager – Hotels, Resorts & Apartments', 'Australia', 'https://www.linkedin.com/in/ACwAABysF_MBgBu8JsLc3Ia1iH68N_H_9z-Ed1k', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jacob Sinnott') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABysF_MBgBu8JsLc3Ia1iH68N_H_9z-Ed1k'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recoHC30aDPoyfOGk', 'Leanne Mackenzie', 'Senior Sales Account Manager', 'Sydney, Australia', 'https://www.linkedin.com/in/leanne-mackenzie-396b66a8', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Leanne Mackenzie') OR linkedin_url = 'https://www.linkedin.com/in/leanne-mackenzie-396b66a8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recoO2NpaxZnI2m5W', 'Winnie Nguyen', 'Strategic Sales Leader - Intelligent Operations', 'Sydney, Australia', 'https://www.linkedin.com/in/winnie-nguyen-94144a67', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Winnie Nguyen') OR linkedin_url = 'https://www.linkedin.com/in/winnie-nguyen-94144a67'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recoT51ICsiKcDOOf', 'Kane Lu', 'VP of Enterprise Sales (Platforms & Embedded Financial Services Specialist)', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAABpBNk0BymOf_bbIhKMxdDCG-wDwOtjW53s', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Kane Lu') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABpBNk0BymOf_bbIhKMxdDCG-wDwOtjW53s'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recoZZjiXX12YFvMG', 'Vince Tassone', 'Head of Business Development', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAAOWyFABjBlXNALdg2cx1BFlorP1hzGGTF8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Vince Tassone') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOWyFABjBlXNALdg2cx1BFlorP1hzGGTF8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recofUWreVDayokvJ', 'Matt Ditchburn', 'Sales Manager SA NT TAS', 'Greater Adelaide Area', 'https://www.linkedin.com/in/ACwAACiNhCgBUVgvskJNb2AjsfmQ8hmD6eGxjHE', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Matt Ditchburn') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACiNhCgBUVgvskJNb2AjsfmQ8hmD6eGxjHE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recooaC5cwS70mgCc', 'Christian Whamond', 'National Sales Manager', 'Greater Adelaide Area', 'https://www.linkedin.com/in/ACwAAAOyA5gBXWMt2uBwBhbre-Jy83RaJ5cyjmk', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Christian Whamond') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOyA5gBXWMt2uBwBhbre-Jy83RaJ5cyjmk'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recp4h7R2QaNFV39c', 'Sean Taylor', 'Executive Chairman', 'Malvern, Australia', 'https://www.linkedin.com/in/sean-taylor-2b19711', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Sean Taylor') OR linkedin_url = 'https://www.linkedin.com/in/sean-taylor-2b19711'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recpQORT0bn6BHDSF', 'Jeremy Auerbach', 'Head of Enterprise ANZ', 'Sydney, Australia', 'https://www.linkedin.com/in/jeremyauerbach', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jeremy Auerbach') OR linkedin_url = 'https://www.linkedin.com/in/jeremyauerbach'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recpYFIBqCTtMDBKg', 'Clint Elliott', 'Regional Sales Manager - Western Australia', 'Perth, Western Australia, Australia', 'https://www.linkedin.com/in/ACwAAATjWbIBcqRSeBGi4CTrVeLVt0wg7PSg0BI', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Clint Elliott') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATjWbIBcqRSeBGi4CTrVeLVt0wg7PSg0BI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recpdnRqd7CgIjRN3', 'Amy Zobec', 'Head of Digital Natives, Australia and New Zealand', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAARq-roBv5Cu8VrZrnUoSezl3CtMDyGzyRk', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Amy Zobec') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAARq-roBv5Cu8VrZrnUoSezl3CtMDyGzyRk'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recpecgItU0gi5QVa', 'Darin Milner', 'Head of Enterprise Sales', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAABvC-ABwpKIVxU1YBQMnGaqzsufzXumsyE', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Darin Milner') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABvC-ABwpKIVxU1YBQMnGaqzsufzXumsyE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recphu2dn4kctBcC0', 'Giulia Francesca Pineda', 'Enterprise Corporate Sales Manager II', 'Pakenham South, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAAYwYLIBYsB8Wo9yMNa5vv2gbpzhoG1vPh0', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Giulia Francesca Pineda') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAYwYLIBYsB8Wo9yMNa5vv2gbpzhoG1vPh0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recpwxIwf8vdldLwJ', 'Adam Beavis', 'Vice President & Country Manager', 'Sydney, Australia', 'https://www.linkedin.com/in/adambeavis', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Adam Beavis') OR linkedin_url = 'https://www.linkedin.com/in/adambeavis'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recq1nSNFasBlnNIX', 'Byron Rudenno', 'Senior Vice President, Europe & Asia-Pacific', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAABJOhgBMxDrdpWxAv5izPepCIiU_Fs7K_8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Byron Rudenno') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABJOhgBMxDrdpWxAv5izPepCIiU_Fs7K_8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recqEX11RBZY77B6g', 'Chris Ponton Dwyer', 'Director Enterprise Sales', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAFvA1QBvKW9emMqnH2H_aS4TRiTtva3Vds', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Chris Ponton Dwyer') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAFvA1QBvKW9emMqnH2H_aS4TRiTtva3Vds'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recqPmhFoblnYAZl2', 'Dane Hart', 'Head of Enterprise Sales & Partnerships | APAC', 'Sydney, Australia', 'https://www.linkedin.com/in/dane-hart-1a20612', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Dane Hart') OR linkedin_url = 'https://www.linkedin.com/in/dane-hart-1a20612'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recqWizVkBIv5yzOt', 'Alicia Boey', 'HR Operation and Payroll Manager APAC', 'Singapore, Singapore', 'https://www.linkedin.com/in/alicia-boey-40367488', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Alicia Boey') OR linkedin_url = 'https://www.linkedin.com/in/alicia-boey-40367488'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recqZZo1eyBzCVww9', 'Colin Birney', 'Head Of Sales at Square AU', 'Melbourne, Australia', 'https://www.linkedin.com/in/colin-birney-17b4472', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Colin Birney') OR linkedin_url = 'https://www.linkedin.com/in/colin-birney-17b4472'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recqaPwfz1TaFQwM0', 'Harry Chichadjian', 'Security Sales Director', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAAyUsaoB0Tz0nauhFlIPnqYBWCA8fsvoWV0', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Harry Chichadjian') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAyUsaoB0Tz0nauhFlIPnqYBWCA8fsvoWV0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recqtSN9Do1MtNIq7', 'Mel Lucas', 'New Business Sales Manager - ANZ', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAABWFjqsB6VGYEmVXqWINgzgqCMq3xRHH6cI', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Mel Lucas') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABWFjqsB6VGYEmVXqWINgzgqCMq3xRHH6cI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recqwgPEDcG9HOaqb', 'James P. Hunt', 'Manager, Sales & Sales Development Teams', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAABCHdYIBr00hL3lxiB51tJqoxgl9RhroRuk', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('James P. Hunt') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABCHdYIBr00hL3lxiB51tJqoxgl9RhroRuk'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recr4uYc7Wbh38g8W', 'Geoff Prentis', 'Vice President, Solutions Engineering - APJ', 'Melbourne, Australia', 'https://www.linkedin.com/in/geoff-prentis-b00a564', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Geoff Prentis') OR linkedin_url = 'https://www.linkedin.com/in/geoff-prentis-b00a564'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recr9dA9XQBAmIO15', 'Julian Lock', 'Senior Sales Director - APAC', 'Greater Brisbane Area', 'https://www.linkedin.com/in/ACwAAAEwvkQBLlxtnjb21fPWmyLZs0tTGTTsEEc', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Julian Lock') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEwvkQBLlxtnjb21fPWmyLZs0tTGTTsEEc'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recrJXIWpZzUFVdEu', 'Jonathon Coleman', 'General Manager, APAC', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAAAirubUBRn2XeS70vqtz-WyqwQ7mK1Z11f8', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jonathon Coleman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAirubUBRn2XeS70vqtz-WyqwQ7mK1Z11f8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recrmnmpkClp0rGFH', 'Malik Ullah', 'Sales Manager', 'Greater Melbourne Area, Australia', 'https://www.linkedin.com/in/ACwAABSWS04BMpi9C8bpyrmAMOphd7E48o6biIc', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Malik Ullah') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABSWS04BMpi9C8bpyrmAMOphd7E48o6biIc'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recsFIYqjezkFlA3E', 'Max McNamara', 'Vice President & Managing Director, Australia & New Zealand', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAnGdWYBALQtJIhmsZDnsj9afulCjw0sSTI', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Max McNamara') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAnGdWYBALQtJIhmsZDnsj9afulCjw0sSTI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recsSWpKQKyNR5ozq', 'Alex Burton', 'Director, Sales', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAT2048B122_qx9pya8C-AQ-92Uubs3z56Q', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Alex Burton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAT2048B122_qx9pya8C-AQ-92Uubs3z56Q'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recsSplvUkS6cyDKJ', 'Krista Gustafson', 'Director of Sales', 'Cremorne, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAzf1qABnShFldMvTWIzjUmD9JnMJRKLS1o', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Krista Gustafson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAzf1qABnShFldMvTWIzjUmD9JnMJRKLS1o'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recsXUWYVWDiOyJ3c', 'Paul Vella', 'Regional Sales Manager, A/NZ', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAACVQxsBQ23KhD2UDsIPYFVsxKiaog4bj8M', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Paul Vella') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACVQxsBQ23KhD2UDsIPYFVsxKiaog4bj8M'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recsboZ42vIyN5NTL', 'Jenny undefined', 'Sales Manager', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAErssD8BlwGaYN-bKCKF2anROPEGrQGufbs', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jenny undefined') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAErssD8BlwGaYN-bKCKF2anROPEGrQGufbs'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recseSYfZzNJxPpkw', 'Angus Kilian', 'Head of GTM, APAC & Middle East, Investor Services', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAemIT0Bjlhb_Q_wtH_oLuhi39NfoyMoP-g', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Angus Kilian') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAemIT0Bjlhb_Q_wtH_oLuhi39NfoyMoP-g'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recspi8HgT7LJCNWp', 'James Delmar', 'Senior Account Director', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAADTlm0BkNi_VcjlJ7x9v7aG1UAWOF6uIcM', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('James Delmar') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADTlm0BkNi_VcjlJ7x9v7aG1UAWOF6uIcM'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recsylV4kkpeiH319', 'Richard Wong', 'Senior Director Customer Success, Australia & New Zealand', 'Melbourne, Australia', 'https://www.linkedin.com/in/richardwongaustralia', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Richard Wong') OR linkedin_url = 'https://www.linkedin.com/in/richardwongaustralia'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rect3C9njDEVqC6zO', 'Brian Zerafa', 'Regional Sales Director', 'Melbourne, Australia', 'https://www.linkedin.com/in/brianzerafa', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Brian Zerafa') OR linkedin_url = 'https://www.linkedin.com/in/brianzerafa'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rectKW4AKpdXGqoOv', 'Dan Shaw', 'Sales Director, Global Cloud APAC', 'Bendigo, Australia', 'https://www.linkedin.com/in/danshawcontact', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Dan Shaw') OR linkedin_url = 'https://www.linkedin.com/in/danshawcontact'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rectNXY59eexHTyAb', 'Simon Horrocks', 'Vice President APAC', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAABADB4BO2VYiDBOL50nKw434VXBEgwfZgU', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Simon Horrocks') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABADB4BO2VYiDBOL50nKw434VXBEgwfZgU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rectOFtYlqt5HMByS', 'Antoine LeTard', 'AVP, Strategy & Operations APJ', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAA3NGUB42-pq_RDAlfX5Rx1rrIgcasgXMs', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Antoine LeTard') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAA3NGUB42-pq_RDAlfX5Rx1rrIgcasgXMs'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rectRoRQ1pkMZeNO6', 'Justin Flower', 'Senior Sales Director - ANZ', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAABKazoBJeCu9HJb7S11DpNkqgKgwa_KWxI', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Justin Flower') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABKazoBJeCu9HJb7S11DpNkqgKgwa_KWxI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rectVS1YdbGNyICcw', 'Chantelle Conway', 'Senior Sales Director (RVP)', 'Sydney, Australia', 'https://www.linkedin.com/in/chantelleconway', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Chantelle Conway') OR linkedin_url = 'https://www.linkedin.com/in/chantelleconway'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rectVc3bJHbT9GI13', 'Isaac Lowrie', 'General Manager - Venue Team | Head of Strategy', 'Sydney, Australia', 'https://www.linkedin.com/in/isaac-lowrie-80249131', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Isaac Lowrie') OR linkedin_url = 'https://www.linkedin.com/in/isaac-lowrie-80249131'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rectbmL5AVFH6uWXT', 'Varun Sareen', 'Regional Sales Manager', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAADIbDxQBg11P5UG_5xS65BTEDXNu-4rZIZE', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Varun Sareen') OR linkedin_url = 'https://www.linkedin.com/in/ACwAADIbDxQBg11P5UG_5xS65BTEDXNu-4rZIZE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rectcO5nArXefQ8EP', 'Andrew Mamonitis', 'Vice President APAC - Manufacturing Division', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAAKve5kBeQOPGRXYdRfTBuoMZaGfyXFeeQM', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Andrew Mamonitis') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKve5kBeQOPGRXYdRfTBuoMZaGfyXFeeQM'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rectn64A84kMTQRZO', 'Andrew McCarthy', 'GM of ANZ, SEA and India', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAP2OIEBhvmsGs4CE-6xJ22XbVoQB91JuM8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Andrew McCarthy') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAP2OIEBhvmsGs4CE-6xJ22XbVoQB91JuM8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rectpbiQYNKRqy9n3', 'Pete Waldron', 'Head of Sales, Australia & New Zealand', 'Sydney, Australia', 'https://www.linkedin.com/in/ACwAAANqzxEBHz3b05ITH52z87B8L8iyQ18Vyqw', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Pete Waldron') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAANqzxEBHz3b05ITH52z87B8L8iyQ18Vyqw'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rects6EbyP1b9gzrC', 'Brendon Mitchell', 'Regional Sales Manager', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAADD53IBe7WZIzMPlk8jHd30OX2MieKnr2U', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Brendon Mitchell') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADD53IBe7WZIzMPlk8jHd30OX2MieKnr2U'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'rectzxXmzoQnBzFMR', 'Theo Gessas', 'Regional Sales Director - South Pacific & A/NZ', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAAOKHQUBdgy57nX289k5GO6NuhEBGNivRUw', 'in queue', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Theo Gessas') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAOKHQUBdgy57nX289k5GO6NuhEBGNivRUw'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recu3fRB91qDpA2zY', 'Tiffany Nee', 'Sales Manager', 'Singapore, Singapore', 'https://www.linkedin.com/in/tiffany-nee-242b242bb', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Tiffany Nee') OR linkedin_url = 'https://www.linkedin.com/in/tiffany-nee-242b242bb'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recu7tk4T0w0wnJRl', 'Michael Shnider', 'Regional Sales Manager, APAC', 'Australia', 'https://www.linkedin.com/in/michael-shnider-9956303', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Michael Shnider') OR linkedin_url = 'https://www.linkedin.com/in/michael-shnider-9956303'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recu9I00xw9FOgiiI', 'John Petty', 'Head of People & Talent', 'Surry Hills, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAACASePcBfp1xMCAf2VWPg0ggvFrYu0mkcQY', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('John Petty') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACASePcBfp1xMCAf2VWPg0ggvFrYu0mkcQY'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recuBBThoXHYTEdsf', 'David Chester🎗', 'Business Development Manager', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAAAUPjPgBAftV8amZGGGw37epDNR023KWRH4', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('David Chester🎗') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAUPjPgBAftV8amZGGGw37epDNR023KWRH4'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recuEwdgvzLQezEHA', 'Emma G.', 'Sales Director - Enterprise ANZ', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAAEW-OMBSiUikiQc5od9J74QxJZrZw67yto', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Emma G.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAEW-OMBSiUikiQc5od9J74QxJZrZw67yto'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recuT26bOW0ated68', 'Zach Sevelle', 'Sales Director, APAC', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAACvIM1YBsdxZ0yJ3OMSZsN5STupfrySEbwA', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Zach Sevelle') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACvIM1YBsdxZ0yJ3OMSZsN5STupfrySEbwA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recuj8cGVdyCoeMFq', 'Sebastian M.', 'Regional Director, ASEAN', 'Singapore, Singapore', 'https://www.linkedin.com/in/ACwAAAjEKkcBfGx73aRaQ2GMjH-uJYbD_KS-PiQ', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Sebastian M.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAjEKkcBfGx73aRaQ2GMjH-uJYbD_KS-PiQ'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recur4xxsoo7nwnCW', 'Mathew Lovelock', 'Sales Director, APAC', 'Perth, Western Australia, Australia', 'https://www.linkedin.com/in/ACwAAFtMhgYBW-sYekAJIBGyT7vFrecRjJtruCI', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Mathew Lovelock') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAFtMhgYBW-sYekAJIBGyT7vFrecRjJtruCI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recusL4GOkdaGuQwG', 'Dave O''Connor', 'Head of Sales', 'The Rocks, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAuWpZQBiUosv7otszGx3nMV5ok5qH-N3ZU', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Dave O''Connor') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAuWpZQBiUosv7otszGx3nMV5ok5qH-N3ZU'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recuweeSVz2qOHOJJ', 'Harsha Hariharan', 'Regional Sales Director', 'Singapore', 'https://www.linkedin.com/in/ACwAAAYKGFgBN8QyhsDGGV_KqcG6vmWvR1nPN6U', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Harsha Hariharan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAYKGFgBN8QyhsDGGV_KqcG6vmWvR1nPN6U'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recvBbsB4iaIpwmfJ', 'Carol Sun', 'Head of Sales | Singapore & Greater China Region', 'Singapore', 'https://www.linkedin.com/in/ACwAAAsI14IBuGinqMwJB3rao0IAXM9ubyukOlc', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Carol Sun') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAsI14IBuGinqMwJB3rao0IAXM9ubyukOlc'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recvCqnk4q9bmG3zT', 'John Cunningham', 'Vice President International Sales', 'Clovelly, Australia', 'https://www.linkedin.com/in/ACwAAAAH_kIBbwloAtOae0M8CZPiAIYUYUKa4cI', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('John Cunningham') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAAH_kIBbwloAtOae0M8CZPiAIYUYUKa4cI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recvOzeMkUtXWDkq4', 'Ashutosh Uniyal', 'Vice President of Sales', 'Melbourne, Australia', 'https://www.linkedin.com/in/ashutoshuniyal1', 'in queue', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ashutosh Uniyal') OR linkedin_url = 'https://www.linkedin.com/in/ashutoshuniyal1'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recvPAh0ed6Lb74gc', 'De''Angello Harris', 'VP Sales, APAC', 'Sydney, Australia', 'https://www.linkedin.com/in/deangello', 'lead_lost', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('De''Angello Harris') OR linkedin_url = 'https://www.linkedin.com/in/deangello'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recvPsd4mPt4pWvdo', 'Nikhil Rolla', 'Country General Manager, Malaysia GBS & Head of Strategic Accounts, SEA', 'Singapore, Singapore', 'https://www.linkedin.com/in/nikhilrolla', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Nikhil Rolla') OR linkedin_url = 'https://www.linkedin.com/in/nikhilrolla'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recvTgdkiKeBSeS91', 'Shane Brown', 'Regional Manager', 'Brisbane, Queensland, Australia', 'https://www.linkedin.com/in/ACwAAAwISTQBtO7_eEoEDkNWw0NbFAighj9pqkY', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Shane Brown') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAwISTQBtO7_eEoEDkNWw0NbFAighj9pqkY'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recvdw9gyw1Yj3day', 'Claire Burke', 'Business Operations Manager', 'Melbourne, Australia', 'https://www.linkedin.com/in/claire-burke-643137a7', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Claire Burke') OR linkedin_url = 'https://www.linkedin.com/in/claire-burke-643137a7'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recvipTMhiETvEGd0', 'Chloe Frost', 'Senior Sales Director - APAC, at Info-Tech Research Group', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAATOy8oBGBIxKGKvs2pKBnzsUUPqxI1fb04', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Chloe Frost') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATOy8oBGBIxKGKvs2pKBnzsUUPqxI1fb04'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recvl3j8ndsB3Icq4', 'Eric H.', 'Regional Sales Manager -APAC', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAACgsyr4BJOzWqxWMZ_MYFZNTDfLwRJN6Zbw', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Eric H.') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACgsyr4BJOzWqxWMZ_MYFZNTDfLwRJN6Zbw'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recvwU1AMRhpwL02u', 'Martin Creighan', 'Vice President Asia Pacific', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAADNZ3cBsk0mgZhMC0WDWCaE4aB2EoK0yds', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Martin Creighan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAADNZ3cBsk0mgZhMC0WDWCaE4aB2EoK0yds'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recwAQu0UuRMlUVTY', 'Nikolas Kalogirou', 'Country Manager - Australia/New Zealand', 'Melbourne, Australia', 'https://www.linkedin.com/in/nikolas-kalogirou', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Nikolas Kalogirou') OR linkedin_url = 'https://www.linkedin.com/in/nikolas-kalogirou'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recwFnWC2LdzQKzSF', 'Khalid Khan', 'Senior Customer Success Manager', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAAc_7k0B80kgPmCvqMAB3MbT08jGJbbuqZM', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Khalid Khan') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAc_7k0B80kgPmCvqMAB3MbT08jGJbbuqZM'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recwRKaoPnNqVoP6v', 'Neill Wiffin', 'Client Director | Strategic Accounts ', 'Melbourne, Australia', 'https://www.linkedin.com/in/neill-wiffin-4005805', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Neill Wiffin') OR linkedin_url = 'https://www.linkedin.com/in/neill-wiffin-4005805'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recwjSaQQ4IAy2gWu', 'Simon Moxham', 'Senior Business Development Manager', 'Greater Perth Area', 'https://www.linkedin.com/in/ACwAAATs9EgBdZUiQhancsUrU7ycWwRJdHYLkhE', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Simon Moxham') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAATs9EgBdZUiQhancsUrU7ycWwRJdHYLkhE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recwsAruTLeNAIASN', 'Jack Kruse', 'Global Sales Director', 'Melbourne, Australia', 'https://www.linkedin.com/in/jack-kruse-24604a88', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jack Kruse') OR linkedin_url = 'https://www.linkedin.com/in/jack-kruse-24604a88'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recwuyHcYhpsb39Y2', 'Jo Salisbury', 'Director of Sales - APAC', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAArnDywBY-W_YMJElzFmFMFXDL6E2tPIiAk', 'connection_requested', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jo Salisbury') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAArnDywBY-W_YMJElzFmFMFXDL6E2tPIiAk'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recx7Id8RVtrSe7Lp', 'Susan Atike', 'Sales Manager', 'Sydney, Australia', 'https://www.linkedin.com/in/susan-atike-a6356711', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Susan Atike') OR linkedin_url = 'https://www.linkedin.com/in/susan-atike-a6356711'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recxUcOFQtVTC01Nq', 'Marea Ford', 'National Sales Manager', 'Greater Brisbane Area', 'https://www.linkedin.com/in/ACwAABAJwk8BTuJfmCiI88ilN9dQ7i3O0_J135o', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Marea Ford') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABAJwk8BTuJfmCiI88ilN9dQ7i3O0_J135o'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recxWx9vzXLMbFN8L', 'Patrick Amate', 'Government Sales Manager', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAWOCoEBb1BzJ6By4N64erm4kYLFYgu0Iao', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Patrick Amate') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAWOCoEBb1BzJ6By4N64erm4kYLFYgu0Iao'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recxXDWYLTSMHZOC9', 'Emilia Mosiejewski', 'Regional Sales Manager (VIC)', 'Melbourne, Australia', 'https://www.linkedin.com/in/ACwAADDsyU0Bt5aPXIdpLLB3eOhxeT-zvEYnncE', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Emilia Mosiejewski') OR linkedin_url = 'https://www.linkedin.com/in/ACwAADDsyU0Bt5aPXIdpLLB3eOhxeT-zvEYnncE'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recxhI9cq8igM1kBE', 'Chelsea Sunderland', 'Sales Manager - Existing Business - APAC ', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAAyVGeIB97GO5yB9sso-d4yKLPmt_7UKyR4', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Chelsea Sunderland') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAyVGeIB97GO5yB9sso-d4yKLPmt_7UKyR4'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recxhnxF9XvYK38nP', 'Paul Wittich', 'General Manager, APAC', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAABjOGgBTkUkcQiZvJBsUactAXM7BKor0gg', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Paul Wittich') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAABjOGgBTkUkcQiZvJBsUactAXM7BKor0gg'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recxvZuSGjuDwrH32', 'Jeffrey Leong', 'Regional Head of Operations ', 'Singapore, Singapore', 'https://www.linkedin.com/in/ACwAAAC-Fa0BhrzNmohSDxecPWmmJe8_18C1seg', 'connection_requested', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Jeffrey Leong') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAC-Fa0BhrzNmohSDxecPWmmJe8_18C1seg'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recxzWxl51HuzL0dK', 'Laura Robinson', 'Revenue Enablement Manager', 'Brisbane, Queensland, Australia', 'https://www.linkedin.com/in/ACwAAAkuEC0B7iQXxb-dGhQ2OtX7AVYipD10t_8', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Laura Robinson') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAkuEC0B7iQXxb-dGhQ2OtX7AVYipD10t_8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recy4yAz2Wq5Y3f3o', 'Mukti Prabhu, GAICD', 'Head of Public sector, Health and Education delivery for Australia and New Zealand', 'Australia', 'https://www.linkedin.com/in/muktiprabhu', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Mukti Prabhu, GAICD') OR linkedin_url = 'https://www.linkedin.com/in/muktiprabhu'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recyGENWenh0noaE6', 'Matt Perkes', 'Sales Director', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAo41fkBA1mBJRDnAK211cbu31oTQKeju3I', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Matt Perkes') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAo41fkBA1mBJRDnAK211cbu31oTQKeju3I'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recyHlYtF43xyzvnz', 'Rob Arora', 'Large Enterprise Account Director', 'Greater Sydney Area', 'https://www.linkedin.com/in/ACwAAA4K_R8B4hxf9HttcFkpLDWImCu4S5R_HWc', 'new', 'Medium', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Rob Arora') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAA4K_R8B4hxf9HttcFkpLDWImCu4S5R_HWc'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recyUVSHamGvBpFYI', 'Tony Walkley', 'Sales Enablement Manager', 'Adelaide, Australia', 'https://www.linkedin.com/in/tonywalkley', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Tony Walkley') OR linkedin_url = 'https://www.linkedin.com/in/tonywalkley'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recyXi4r9eKUwsjlc', 'Altay Ayyuce', 'Area Vice President, ANZ', 'Greater Melbourne Area', 'https://www.linkedin.com/in/ACwAAAJ7z4AB4W-UAe3qALVwshm3r1SLwVEtbZ8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Altay Ayyuce') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAJ7z4AB4W-UAe3qALVwshm3r1SLwVEtbZ8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recybZzn3lZjl04Z6', 'Sarah Jarman', 'Sales Director, APJ - ANZ', 'Melbourne, Victoria, Australia', 'https://www.linkedin.com/in/ACwAADBXEFUBIeEdfQjPkp1MWp2yCUJ7xf3j0zI', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Sarah Jarman') OR linkedin_url = 'https://www.linkedin.com/in/ACwAADBXEFUBIeEdfQjPkp1MWp2yCUJ7xf3j0zI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recyeFdD4na10NVPi', 'Shane Lowe', 'Head of Strategic Partnerships, APAC', 'Sydney, Australia', 'https://www.linkedin.com/in/shane-lowe-64204455', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Shane Lowe') OR linkedin_url = 'https://www.linkedin.com/in/shane-lowe-64204455'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recysBAWEGQQD2rUg', 'James Demetrios', 'Director of Sales', 'Bendigo, Australia', 'https://www.linkedin.com/in/james-demetrios-596096b0', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('James Demetrios') OR linkedin_url = 'https://www.linkedin.com/in/james-demetrios-596096b0'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recz6q1ijSZaF9VBU', 'Ravi Chandar', 'Director, Regional Sales', 'Melbourne, Australia', 'https://www.linkedin.com/in/ravichandar', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ravi Chandar') OR linkedin_url = 'https://www.linkedin.com/in/ravichandar'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reczBj20GjXPpN3Lr', 'Damon Etherington', 'Head of Enterprise, ANZ', 'Greater Sydney Area, Australia', 'https://www.linkedin.com/in/ACwAAAKVNDcBG892ycvxNPP-_gIBDQUZcO0mVMs', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Damon Etherington') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAKVNDcBG892ycvxNPP-_gIBDQUZcO0mVMs'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reczFh7JbA60aFiX0', 'Paul Broughton', 'Senior Vice President & Managing Director - Asia Pacific & Japan', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAD887EBrT2xyWideBuXvcWwwp0jTEoYcbA', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Paul Broughton') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAD887EBrT2xyWideBuXvcWwwp0jTEoYcbA'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reczGPRI3ksBCfbks', 'Andrew McCarthy', 'GM of ANZ, SEA and India', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAP2OIEBhvmsGs4CE-6xJ22XbVoQB91JuM8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Andrew McCarthy') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAP2OIEBhvmsGs4CE-6xJ22XbVoQB91JuM8'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reczaCr3uNwf2fmrD', 'Lewis Steere', 'State Manager - Victoria', 'Greater Melbourne Area, Australia', 'https://www.linkedin.com/in/ACwAACE3Ry4B4IYhJz2Cv54qnuQo4qw_IY2Ieso', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Lewis Steere') OR linkedin_url = 'https://www.linkedin.com/in/ACwAACE3Ry4B4IYhJz2Cv54qnuQo4qw_IY2Ieso'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reczcYGAJWd0EqR4G', 'Pat Bolster', 'Managing Director Australia', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAAIzlQEBbRKtxGd4t4-JIMxf1JH2hiE4BWc', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Pat Bolster') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAAIzlQEBbRKtxGd4t4-JIMxf1JH2hiE4BWc'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reczel0ew6m0BWo9c', 'Brett Waters', 'MD APAC', 'Randwick, Australia', 'https://www.linkedin.com/in/muddywaters', 'in queue', NULL, 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Brett Waters') OR linkedin_url = 'https://www.linkedin.com/in/muddywaters'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recziU0VUxmZa9oBu', 'Ki Currie', 'APAC Commercial Sales Manager', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAABUA8IIBMS9dHI4yCdaRcyDvzwf7guhYwqI', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ki Currie') OR linkedin_url = 'https://www.linkedin.com/in/ACwAABUA8IIBMS9dHI4yCdaRcyDvzwf7guhYwqI'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reczj7M20lbjxhCYh', 'Gavin James Vermaas', 'GRC Solution Sales Director', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAACCn8ABF1GLONyPMwmeaszSP_tkM3_1UMY', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Gavin James Vermaas') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACCn8ABF1GLONyPMwmeaszSP_tkM3_1UMY'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'recztVMs8FF6mKhQj', 'Ashutosh Razdan', 'Director and Sector Lead for Energy, Utilities and Resources -ANZ', 'Melbourne, Australia', 'https://www.linkedin.com/in/ashutosh-razdan-4718a74', 'new', NULL, '', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Ashutosh Razdan') OR linkedin_url = 'https://www.linkedin.com/in/ashutosh-razdan-4718a74'
);

INSERT INTO people (airtable_id, name, company_role, employee_location, linkedin_url, stage, confidence_level, lead_source, automation_started_at, is_favourite, created_at, updated_at)
SELECT 'reczzKeY3kebF8lzD', 'Tim Bentley', 'VP APJ', 'Sydney, New South Wales, Australia', 'https://www.linkedin.com/in/ACwAAACafEQBBT8hVHbuJIxI3c1Uesg3Zxs0rP8', 'new', 'High', 'LinkedIn Job Posts', NOW(), false, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM people 
    WHERE LOWER(name) = LOWER('Tim Bentley') OR linkedin_url = 'https://www.linkedin.com/in/ACwAAACafEQBBT8hVHbuJIxI3c1Uesg3Zxs0rP8'
);