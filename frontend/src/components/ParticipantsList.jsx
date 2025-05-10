import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ParticipantsList = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/participants');
        setParticipants(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Participants List</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Full Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone Number</th>
            <th className="py-2 px-4 border-b">College Name</th>
            <th className="py-2 px-4 border-b">Degree</th>
            <th className="py-2 px-4 border-b">Year of Study</th>
            <th className="py-2 px-4 border-b">CGPA</th>
            <th className="py-2 px-4 border-b">Tech Stack</th>
            <th className="py-2 px-4 border-b">Other Skills</th>
            <th className="py-2 px-4 border-b">Project Idea</th>
            <th className="py-2 px-4 border-b">LinkedIn</th>
            <th className="py-2 px-4 border-b">GitHub</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr key={participant._id}>
              <td className="py-2 px-4 border-b">{participant.full_name}</td>
              <td className="py-2 px-4 border-b">{participant.email}</td>
              <td className="py-2 px-4 border-b">{participant.phone_number}</td>
              <td className="py-2 px-4 border-b">{participant.college_name}</td>
              <td className="py-2 px-4 border-b">{participant.degree}</td>
              <td className="py-2 px-4 border-b">{participant.year_of_study}</td>
              <td className="py-2 px-4 border-b">{participant.cgpa}</td>
              <td className="py-2 px-4 border-b">{participant.tech_stack.join(', ')}</td>
              <td className="py-2 px-4 border-b">{participant.other_skills}</td>
              <td className="py-2 px-4 border-b">{participant.project_idea}</td>
              <td className="py-2 px-4 border-b">
                <a href={participant.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  LinkedIn
                </a>
              </td>
              <td className="py-2 px-4 border-b">
                <a href={participant.github} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  GitHub
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantsList;