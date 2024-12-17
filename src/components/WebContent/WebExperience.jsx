import axios from 'axios';
import React, { useState, useEffect } from 'react';
import config from '../config';
import Loading from '../Admin/Loading';
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaBriefcase } from "react-icons/fa";


const WebExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false)

  const getAllExperiences = async() => {
      setLoading(true)
      try {
          const res = await axios.get(`${config.API_URL}experience/getAllExperiences`)
          setExperiences(res.data)
      } catch (error) {
          console.log(error)
      } finally{
          setLoading(false)
      }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  useEffect(()=>{
      getAllExperiences();
  },[])

  if (loading) {
      return <Loading />;
  }

  return (
    <section id='experience'>
      <div className="min-h-screen bg-gray-100 text-gray-800 py-12 px-2 sm:px-6">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Work Experience</h2>

      <VerticalTimeline>
        {experiences.map((exp, index) => (
          <VerticalTimelineElement
            key={index}
            className="vertical-timeline-element--work"
            contentStyle={{ background: "#ffffff", color: "#000" }}
            contentArrowStyle={{ borderRight: "7px solid #000" }}
            date={
              <span style={{ color: "black" }}>
                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
              </span>
            }
            iconStyle={{ background: "rgb(62, 2, 22)", color: "#fff" }}
            icon={<FaBriefcase />}
          >
            <h3 className="vertical-timeline-element-title text-lg font-bold">{exp.title}</h3>
            <h4 className="vertical-timeline-element-subtitle text-sm text-gray-500">{exp.company}</h4>
            <p className="text-sm text-gray-500">{exp.location}</p>
            <ul className="list-disc pl-5 mt-4 text-sm">
              {exp.description.map((desc, i) => (
                <li key={i}>{desc}</li>
              ))}
            </ul>
            <div className="text-sm mt-4">
              <strong>Technologies:</strong> {exp.technologies.join(", ")}
            </div>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
    </section>
    
  );
};

export default WebExperience;

