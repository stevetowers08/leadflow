import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DataTest = () => {
  const [companies, setCompanies] = useState([]);
  const [people, setPeople] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testDataFetch = async () => {
      try {
        console.log('🔍 Testing data fetch...');
        
        // Test companies
        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select('id, name, website')
          .limit(5);
        
        console.log('Companies result:', { data: companiesData, error: companiesError });
        
        if (companiesError) {
          console.error('Companies error:', companiesError);
          setError(`Companies error: ${companiesError.message}`);
        } else {
          setCompanies(companiesData || []);
        }

        // Test people
        const { data: peopleData, error: peopleError } = await supabase
          .from('people')
          .select('id, name, email_address')
          .limit(5);
        
        console.log('People result:', { data: peopleData, error: peopleError });
        
        if (peopleError) {
          console.error('People error:', peopleError);
          setError(`People error: ${peopleError.message}`);
        } else {
          setPeople(peopleData || []);
        }

        // Test jobs
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('id, title, location')
          .limit(5);
        
        console.log('Jobs result:', { data: jobsData, error: jobsError });
        
        if (jobsError) {
          console.error('Jobs error:', jobsError);
          setError(`Jobs error: ${jobsError.message}`);
        } else {
          setJobs(jobsData || []);
        }

      } catch (err) {
        console.error('General error:', err);
        setError(`General error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    testDataFetch();
  }, []);

  if (loading) {
    return <div>Loading test data...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        <h2>Error:</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Data Test Results</h1>
      
      <h2>Companies ({companies.length})</h2>
      <ul>
        {companies.map(company => (
          <li key={company.id}>
            {company.name} - {company.website}
          </li>
        ))}
      </ul>

      <h2>People ({people.length})</h2>
      <ul>
        {people.map(person => (
          <li key={person.id}>
            {person.name} - {person.email_address}
          </li>
        ))}
      </ul>

      <h2>Jobs ({jobs.length})</h2>
      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            {job.title} - {job.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataTest;
