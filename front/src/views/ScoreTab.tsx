import React, { useEffect, useState } from "react";
import { getScores } from "../services/users.service";
import { User } from "../interfaces/user.interface";
import "../assets/styles/ScoreTab.scss";
import { motion } from 'framer-motion'

const ScoreTab = () => {
  const [scores, setScores] = useState<User[]>();

  const fetchScores = async () => {
    const scoreFetched = await getScores();
    console.log(scoreFetched);
    setScores(scoreFetched);
  };

  useEffect(() => {
    fetchScores();
  }, []);


  return (
    <div className="score-tab">
      <h1 className="drag">Score Tab</h1>
      {scores && scores.length > 0 ? (
        <table className="score-table">
          <thead>
            <tr>
              <th>Player Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No scores available.</p>
      )}
    </div>
  );
};

export default ScoreTab;
