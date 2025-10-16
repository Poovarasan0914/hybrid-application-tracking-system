import { useEffect, useState } from 'react';
import { botService } from '../services/botService';
import PendingApplications from '../components/bot/PendingApplications';
import BotStats from '../components/bot/BotStats';
import ActiveJobs from '../components/bot/ActiveJobs';

const BotPage = () => {
  const [data, setData] = useState({ pendingApplications: [], activeJobs: [], applicationStats: [] });
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [autoMode, setAutoMode] = useState(true);
  const [mimicStats, setMimicStats] = useState(null);
  const [mimicProcessing, setMimicProcessing] = useState(false);

  const load = async () => {
    try {
      const res = await botService.getDashboard();
      setData({
        pendingApplications: res.pendingApplications || [],
        activeJobs: res.activeJobs || [],
        applicationStats: res.applicationStats || []
      });
      
      const mimicRes = await botService.getBotMimicStats();
      setMimicStats(mimicRes);
    } catch {}
  };

  const processApplications = async () => {
    if (processing) return;
    
    setProcessing(true);
    try {
      const res = await botService.autoProcessTechnical();
      if (res.processed > 0) {
        setMessage(`🤖 Auto-processed ${res.processed} technical applications`);
        await load();
      }
    } catch (err) {
      setMessage('Failed to process applications');
    }
    setProcessing(false);
  };

  const handleManualProcess = async () => {
    await processApplications();
  };

  const handleBotMimicTrigger = async () => {
    setMimicProcessing(true);
    try {
      const res = await botService.triggerBotMimic();
      setMessage(`🎯 Bot Mimic: ${res.message}`);
      await load();
    } catch (err) {
      setMessage('Failed to trigger Bot Mimic');
    }
    setMimicProcessing(false);
  };

  const handleToggleBotMimic = async (action) => {
    try {
      const res = await botService.toggleBotMimic(action);
      setMessage(`🎯 Bot Mimic ${action}ed successfully`);
      await load();
    } catch (err) {
      setMessage(`Failed to ${action} Bot Mimic`);
    }
  };

  useEffect(() => {
    load();
    
    const interval = setInterval(() => {
      if (autoMode && !processing) {
        processApplications();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [autoMode, processing]);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 20px'
    }}>
      <div style={{
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h1 style={{
            fontSize: '2rem',
            color: '#1f2937',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>🤖</span> Bot Dashboard
            <span style={{
              fontSize: '1rem',
              color: '#6b7280',
              fontWeight: '400',
              marginLeft: '0.5rem'
            }}>
              Technical Roles Only
            </span>
          </h1>

          <div style={{
            display: 'flex',
            gap: '1rem'
          }}>
            <button
              onClick={() => setAutoMode(!autoMode)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: autoMode ? '#059669' : 'transparent',
                color: autoMode ? '#ffffff' : '#374151',
                border: autoMode ? 'none' : '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                if (autoMode) {
                  e.currentTarget.style.backgroundColor = '#047857';
                } else {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseOut={(e) => {
                if (autoMode) {
                  e.currentTarget.style.backgroundColor = '#059669';
                } else {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {autoMode ? '🤖 Auto Mode ON' : '⏸️ Auto Mode OFF'}
            </button>
            <button 
              onClick={handleManualProcess}
              disabled={processing}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: processing ? '#e5e7eb' : '#2563eb',
                color: processing ? '#9ca3af' : '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: processing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (!processing) {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                }
              }}
              onMouseOut={(e) => {
                if (!processing) {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }
              }}
            >
              {processing ? 'Processing...' : 'Process Now'}
            </button>
            <button 
              onClick={handleBotMimicTrigger}
              disabled={mimicProcessing}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: mimicProcessing ? '#e5e7eb' : '#7c3aed',
                color: mimicProcessing ? '#9ca3af' : '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: mimicProcessing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => {
                if (!mimicProcessing) {
                  e.currentTarget.style.backgroundColor = '#6d28d9';
                }
              }}
              onMouseOut={(e) => {
                if (!mimicProcessing) {
                  e.currentTarget.style.backgroundColor = '#7c3aed';
                }
              }}
            >
              {mimicProcessing ? 'Mimicking...' : '🎯 Bot Mimic'}
            </button>
            {mimicStats && (
              <button 
                onClick={() => handleToggleBotMimic(mimicStats.isRunning ? 'stop' : 'start')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: mimicStats.isRunning ? '#dc2626' : '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = mimicStats.isRunning ? '#b91c1c' : '#047857';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = mimicStats.isRunning ? '#dc2626' : '#059669';
                }}
              >
                {mimicStats.isRunning ? '⏹️ Stop' : '▶️ Start'}
              </button>
            )}
          </div>
        </div>

        {message && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#dcfce7',
            border: '1px solid #22c55e',
            borderRadius: '8px',
            color: '#15803d',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{message}</span>
            <button 
              onClick={() => setMessage('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#15803d',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              ×
            </button>
          </div>
        )}

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: autoMode ? '#dcfce7' : '#fef3c7',
            border: `1px solid ${autoMode ? '#22c55e' : '#d97706'}`,
            borderRadius: '8px',
            color: autoMode ? '#15803d' : '#92400e'
          }}>
            <strong>Bot Status:</strong> {autoMode ? '🤖 Automatically processing technical applications every 30 seconds' : '⏸️ Auto-processing paused - use manual processing'}
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: '#e0f2fe',
            border: '1px solid #0284c7',
            borderRadius: '8px',
            color: '#0369a1'
          }}>
            <strong>Bot Mimic:</strong> {mimicStats?.isRunning ? '🎯 Human-like workflow processing active (Applied → Reviewed → Interview → Offer)' : '⏸️ Bot Mimic paused'}
            {mimicStats && ` | Total Technical Apps: ${mimicStats.totalTechnicalApplications}`}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              color: '#1f2937',
              marginBottom: '1.5rem',
              fontWeight: '600'
            }}>
              Technical Application Stats
            </h2>
            <BotStats stats={data.applicationStats} />
          </div>
          
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              color: '#1f2937',
              marginBottom: '1.5rem',
              fontWeight: '600'
            }}>
              Bot Mimic Workflow Stats
            </h2>
            {mimicStats?.stageDistribution && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {Object.entries(mimicStats.stageDistribution).map(([stage, count]) => (
                  <div 
                    key={stage}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px'
                    }}
                  >
                    <span style={{
                      color: '#4b5563',
                      fontSize: '0.875rem',
                      textTransform: 'capitalize'
                    }}>
                      {stage}:
                    </span>
                    <span style={{
                      color: '#1f2937',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              color: '#1f2937',
              marginBottom: '1.5rem',
              fontWeight: '600'
            }}>
              Pending Technical Applications
            </h2>
            <PendingApplications 
              applications={data.pendingApplications} 
              onOpen={() => {}} 
            />
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              color: '#1f2937',
              marginBottom: '1.5rem',
              fontWeight: '600'
            }}>
              Active Technical Jobs
            </h2>
            <ActiveJobs jobs={data.activeJobs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotPage;
