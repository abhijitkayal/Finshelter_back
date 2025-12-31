import React from "react";
// You can style it separately

const ServiceProgress = ({ stages, currentStage }) => {
  const totalStages = stages.length;
  const currentStageIndex = stages.indexOf(currentStage);

  return (
    <div className="progress-bar-container">
      {stages.map((stage, index) => {
        const isActive = index <= currentStageIndex;
        const isCompleted = index < currentStageIndex;
        return (
          <div
            key={index}
            className={`progress-step ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
          >
            <div className="step-circle">{isCompleted ? "✔" : index + 1}</div>
            <div className="step-label">{stage}</div>
            {index < totalStages - 1 && <div className="step-line"></div>}
          </div>
        );
      })}
    </div>
  );
};

export default ServiceProgress;
