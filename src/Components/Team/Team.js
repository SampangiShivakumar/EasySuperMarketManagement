// Team.jsx
import React from 'react';
import './Team.css';

const teamData = [
  {
    name: 'SAMPANGI SHIVA KUMAR',
    role: 'Backend & Design',
    desc: 'Specialized in server-side logic and UI architecture.',
    img: 'https://img.icons8.com/ios-filled/100/user-male-circle.png',
    linkedin: 'https://www.linkedin.com/in/sampangi-shiva-kumar', // Replace with actual
    github: 'https://github.com/shiva-kumar', // Replace with actual
  },
  {
    name: 'VINEELA MARSETTY',
    role: 'Frontend & Design',
    desc: 'Focused on building interactive UI and responsive design.',
    img: 'https://img.icons8.com/ios-filled/100/user-female-circle.png',
    linkedin: 'https://www.linkedin.com/in/vineela-marsetty', // Replace with actual
    github: 'https://github.com/vineela-marsetty', // Replace with actual
  },
  {
    name: 'AMZAD',
    role: 'Database Developer',
    desc: 'Expert in managing and optimizing data storage.',
    img: 'https://img.icons8.com/ios-filled/100/user-male-circle.png',
    linkedin: 'https://www.linkedin.com/in/amjad-profile', // Replace with actual
    github: 'https://github.com/amjad-profile', // Replace with actual
  },
];

const Team = () => {
  return (
    <div className="team-container">
      <h1>Our Team</h1>
      <div className="team-grid">
        {teamData.map((member, index) => (
          <div key={index} className="team-card">
            <img src={member.img} alt={member.name} />
            <h3>{member.name}</h3>
            <p className="role">{member.role}</p>
            <p className="desc">{member.desc}</p>
            <div className="social-icons">
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                <img src="https://img.icons8.com/ios-filled/24/linkedin.png" alt="LinkedIn" />
              </a>
              <a href={member.github} target="_blank" rel="noopener noreferrer">
                <img src="https://img.icons8.com/ios-filled/24/github.png" alt="GitHub" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;