"use client";

import React, { useState, useRef, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import "./DeploymentMain.css";

const DeploymentMain = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(240); // 2 minutes to complete
  const [isPlaying, setIsPlaying] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [dividerPosition, setDividerPosition] = useState(50); // Initial position in percentage

  // Reference graph - a comprehensive development workflow
  const referenceNodes = [
    { id: 1, label: "Project", x: 250, y: 30 },
    { id: 2, label: "Frontend", x: 120, y: 100 },
    { id: 3, label: "Backend", x: 380, y: 100 },
    { id: 4, label: "React", x: 50, y: 170 },
    { id: 5, label: "CSS", x: 130, y: 170 },
    { id: 6, label: "JavaScript", x: 210, y: 170 },
    { id: 7, label: "Node.js", x: 300, y: 170 },
    { id: 8, label: "Express", x: 380, y: 170 },
    { id: 9, label: "MongoDB", x: 460, y: 170 },
    { id: 10, label: "Testing", x: 120, y: 240 }, // Testing
    { id: 11, label: "API", x: 380, y: 240 }, // API
    { id: 12, label: "Vercel", x: 120, y: 310 }, // Vercel
    { id: 13, label: "Heroku", x: 380, y: 310 }, // Heroku
  ];

  const referenceConnections = [
    { source: 1, target: 2 }, // Project -> Frontend
    { source: 1, target: 3 }, // Project -> Backend
    { source: 2, target: 4 }, // Frontend -> React
    { source: 2, target: 5 }, // Frontend -> CSS
    { source: 2, target: 6 }, // Frontend -> JavaScript
    { source: 3, target: 7 }, // Backend -> Node.js
    { source: 3, target: 8 }, // Backend -> Express
    { source: 3, target: 9 }, // Backend -> MongoDB
    { source: 4, target: 10 }, // React -> Testing
    { source: 5, target: 10 }, // CSS -> Testing
    { source: 6, target: 10 }, // JavaScript -> Testing
    { source: 7, target: 11 }, // Node.js -> API
    { source: 8, target: 11 }, // Express -> API
    { source: 9, target: 11 }, // MongoDB -> API
    { source: 10, target: 12 }, // Testing -> Vercel
    { source: 11, target: 13 }, // API -> Heroku
  ];

  // Player's workspace state
  const [playerNodes, setPlayerNodes] = useState([]);
  const [playerConnections, setPlayerConnections] = useState([]);

  // For drag and drop functionality
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingNode, setConnectingNode] = useState(null);
  const playerAreaRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Initialize game
  useEffect(() => {
    // Initialize player's workspace with randomized node positions
    const playerArea = playerAreaRef.current?.getBoundingClientRect();
    if (playerArea) {
      const maxX = playerArea.width - 80; // Constrain to visible width
      const maxY = playerArea.height - 40; // Constrain to visible height

      setPlayerNodes(
        referenceNodes.map((node) => ({
          ...node,
          // Randomize positions but keep them within the visible area
          x: Math.floor(Math.random() * maxX),
          y: Math.floor(Math.random() * maxY),
        }))
      );
      setPlayerConnections([]);
      setGameCompleted(false);

      // Reset scroll position to top-left corner
      playerAreaRef.current.scrollTo(0, 0);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;

    if (isPlaying && !gameCompleted && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && !gameCompleted) {
      // Time's up - show failure message
      setIsPlaying(false);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timer, gameCompleted]);

  // Check if graphs match
  const checkGraphMatch = () => {
    if (playerConnections.length !== referenceConnections.length) {
      return false;
    }

    // Check if all connections match (in either direction)
    return referenceConnections.every((refConn) =>
      playerConnections.some(
        (playerConn) =>
          (playerConn.source === refConn.source &&
            playerConn.target === refConn.target) ||
          (playerConn.source === refConn.target &&
            playerConn.target === refConn.source)
      )
    );
  };

  // Effect to check for game completion
  useEffect(() => {
    if (isPlaying && playerConnections.length === referenceConnections.length) {
      const graphsMatch = checkGraphMatch();
      if (graphsMatch) {
        // Game completed!
        setGameCompleted(true);
        setIsPlaying(false);
      }
    }
  }, [playerConnections, isPlaying]);

  // Draggable Divider Component
  const DraggableDivider = ({ onDrag }) => {
    const handleMouseDown = (e) => {
      e.preventDefault();
      const startY = e.clientY;

      const handleMouseMove = (e) => {
        const deltaY = e.clientY - startY;
        onDrag(deltaY);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    return (
      <div
        className="win95-divider"
        onMouseDown={handleMouseDown}
        style={{ cursor: "row-resize" }}
      />
    );
  };

  // Handle node dragging
  const handleMouseDown = (e, node) => {
    if (!isPlaying || gameCompleted) return;

    const rect = e.target.getBoundingClientRect();
    setDraggedNode(node);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    // Prevent default to avoid text selection during drag
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    const playerArea = playerAreaRef.current?.getBoundingClientRect();
    if (playerArea) {
      setMousePosition({
        x: e.clientX - playerArea.left,
        y: e.clientY - playerArea.top,
      });

      if (draggedNode && isPlaying && !gameCompleted) {
        const newX = e.clientX - playerArea.left - dragOffset.x;
        const newY = e.clientY - playerArea.top - dragOffset.y;

        // Update node position
        setPlayerNodes(
          playerNodes.map((node) =>
            node.id === draggedNode.id
              ? {
                  ...node,
                  x: Math.max(0, Math.min(newX, playerArea.width - 80)),
                  y: Math.max(0, Math.min(newY, playerArea.height - 40)),
                }
              : node
          )
        );
      }
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  // Check if a connection is correct according to the reference
  const isCorrectConnection = (source, target) => {
    return referenceConnections.some(
      (conn) =>
        (conn.source === source && conn.target === target) ||
        (conn.source === target && conn.target === source)
    );
  };

  // Handle node connection
  const handleNodeClick = (node) => {
    if (!isPlaying || gameCompleted) return;

    if (connectingNode) {
      // Complete connection if clicking on a different node
      if (connectingNode.id !== node.id) {
        // Check if connection already exists
        const connectionExists = playerConnections.some(
          (conn) =>
            (conn.source === connectingNode.id && conn.target === node.id) ||
            (conn.source === node.id && conn.target === connectingNode.id)
        );

        if (!connectionExists) {
          const newConnection = { source: connectingNode.id, target: node.id };
          setPlayerConnections([...playerConnections, newConnection]);
          
          // Increase score by 10 if the connection is correct
          if (isCorrectConnection(connectingNode.id, node.id)) {
            setScore(prevScore => prevScore + 6);
          }
        }

        setConnectingNode(null);
      } else {
        // Clicking on the same node cancels the connection
        setConnectingNode(null);
      }
    } else {
      // Start connection
      setConnectingNode(node);
    }
  };

  // Remove a connection
  const handleRemoveConnection = (index) => {
    if (!isPlaying || gameCompleted) return;

    const connectionToRemove = playerConnections[index];
    
    // Decrease score by 10 if the connection was correct
    if (isCorrectConnection(connectionToRemove.source, connectionToRemove.target)) {
      setScore(prevScore => Math.max(0, prevScore - 10));
    }
    
    setPlayerConnections(playerConnections.filter((_, i) => i !== index));
  };

  // Draw a connection line
  const renderConnection = (
    source,
    target,
    isReference = false,
    index = null
  ) => {
    const sourceNode = isReference
      ? referenceNodes.find((n) => n.id === source)
      : playerNodes.find((n) => n.id === source);

    const targetNode = isReference
      ? referenceNodes.find((n) => n.id === target)
      : playerNodes.find((n) => n.id === target);

    if (!sourceNode || !targetNode) {
      console.error("Source or target node not found:", { source, target });
      return null;
    }

    console.log("Rendering connection:", {
      source: sourceNode.label,
      target: targetNode.label,
      sourceX: sourceNode.x,
      sourceY: sourceNode.y,
      targetX: targetNode.x,
      targetY: targetNode.y,
    });

    return (
      <>
        <line
          x1={sourceNode.x + 35} // Adjust for node center
          y1={sourceNode.y + 15} // Adjust for node center
          x2={targetNode.x + 35} // Adjust for node center
          y2={targetNode.y + 15} // Adjust for node center
          stroke={isReference ? "#000" : "#0000AA"} // Black for reference, blue for player
          strokeWidth={2}
        />

        {/* Add a clickable area to remove connections in player area */}
        {!isReference && index !== null && (
          <circle
            cx={(sourceNode.x + targetNode.x) / 2 + 30} // Midpoint X
            cy={(sourceNode.y + targetNode.y) / 2 + 15} // Midpoint Y
            r={8}
            fill="#c0c0c0"
            stroke="#000"
            strokeWidth={1}
            style={{ cursor: "pointer" }}
            onClick={() => handleRemoveConnection(index)}
          />
        )}
      </>
    );
  };

  // Restart game handler
  const handleRestartGame = () => {
    // Reset the game
    const playerArea = playerAreaRef.current?.getBoundingClientRect();
    if (playerArea) {
      const maxX = playerArea.width - 80;
      const maxY = playerArea.height - 40;

      setPlayerNodes(
        referenceNodes.map((node) => ({
          ...node,
          x: Math.floor(Math.random() * maxX),
          y: Math.floor(Math.random() * (maxY - 50)) + 50,
        }))
      );
      setPlayerConnections([]);
      setTimer(120);
      setIsPlaying(true);
      setGameCompleted(false);
      setScore(0);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="win95-container">
      <div className="win95-window">
        <div className="win95-title-bar">
          <div className="win95-title">Windows 95 Development Graph Game</div>
          <div className="win95-window-controls">
            <button className="win95-button win95-minimize">-</button>
            <button className="win95-button win95-maximize">□</button>
            <button className="win95r-button win95-close">×</button>
          </div>
        </div>

        <div className="win95-window-content">
          {/* Game info bar */}
          <div className="win95-info-bar">
            <div className="win95-info-item">
              <span className="win95-info-label">Score:</span> {score}
            </div>
            <div className="win95-info-item">
              <span className="win95-info-label">Time:</span>{" "}
              {formatTime(timer)}
            </div>
            <div className="win95-info-item">
              <span className="win95-info-label">Connections:</span>{" "}
              {playerConnections.length}/{referenceConnections.length}
            </div>
          </div>

          {/* Player's workspace */}
          <div
            className="player-area"
            ref={playerAreaRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              handleMouseUp();
              setConnectingNode(null);
            }}
            style={{ height: `${dividerPosition}%` }}
          >
            <svg width="100%" height="100%">
              {/* Player connections */}
              {playerConnections.map((conn, i) => (
                <React.Fragment key={`conn-${i}`}>
                  {renderConnection(conn.source, conn.target, false, i)}
                </React.Fragment>
              ))}

              {/* Temporary connection line */}
              {connectingNode && (
                <line
                  x1={connectingNode.x + 35}
                  y1={connectingNode.y + 15}
                  x2={mousePosition.x}
                  y2={mousePosition.y}
                  stroke="#999"
                  strokeWidth={2}
                  strokeDasharray="5,5"
                />
              )}
            </svg>

            {/* Player nodes */}
            {playerNodes.map((node) => (
              <div
                key={`player-node-${node.id}`}
                className={`win95-node ${
                  connectingNode?.id === node.id ? "connecting" : ""
                }`}
                style={{ left: node.x, top: node.y }}
                onMouseDown={(e) => handleMouseDown(e, node)}
                onClick={() => handleNodeClick(node)}
              >
                {node.label}
              </div>
            ))}

            {/* Game completed message */}
            {gameCompleted && (
              <>
                <div className="win95-popup-overlay"></div>
                <div className="win95-popup visible">
                  <div className="win95-popup-title-bar">
                    <div className="win95-popup-title">Game Completed!</div>
                    <button className="win95-close-button">×</button>
                  </div>
                  <div className="win95-popup-content">
                    <div className="win95-popup-icon">🏆</div>
                    <div className="win95-popup-message">
                      Congratulations! You've successfully completed the graph!
                    </div>
                    <div className="win95-popup-score">Final Score: {score}</div>
                    <div className="win95-popup-buttons">
                      <button
                        className="win95s-button"
                        onClick={() => {
                          // Sign out the user first
                          signOut(auth)
                            .then(() => {
                              // Then redirect to login page
                              window.location.href = "/";
                            })
                            .catch((error) => {
                              console.error("Sign out error:", error);
                              // Still redirect even if there's an error
                              window.location.href = "/";
                            });
                        }}
                      >
                        Return to Login
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Draggable Divider */}
          <DraggableDivider
            onDrag={(deltaY) => {
              const newPosition =
                dividerPosition + (deltaY / window.innerHeight) * 100;
              setDividerPosition(Math.max(20, Math.min(80, newPosition))); // Limit the divider position
            }}
          />

          {/* Reference graph */}
          <div
            className="reference-area"
            style={{ height: `${100 - dividerPosition}%` }}
          >
            <div className="win95-section-title">Reference Graph</div>
            <svg width="100%" height="100%">
              {/* Reference connections */}
              {referenceConnections.map((conn, i) => (
                <React.Fragment key={`ref-conn-${i}`}>
                  {renderConnection(conn.source, conn.target, true)}
                </React.Fragment>
              ))}
            </svg>

            {/* Reference nodes */}
            {referenceNodes.map((node) => (
              <div
                key={`ref-node-${node.id}`}
                className="win95-node reference-node"
                style={{ left: node.x, top: node.y }}
              >
                {node.label}
              </div>
            ))}
          </div>
        </div>

        <div className="win95-status-bar">
          <div className="win95-status-item">
            {isPlaying ? "Playing" : gameCompleted ? "Game Completed" : "Ready"}
          </div>
          <div className="win95-status-item">Nodes: {playerNodes.length}</div>
          <div className="win95-status-item">
            Connections: {playerConnections.length}/
            {referenceConnections.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentMain;