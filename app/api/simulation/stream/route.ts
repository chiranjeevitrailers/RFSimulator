import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import RealtimeSimulationEngine, { SimulationMessage, SimulationKPIs } from '@/lib/realtime-simulation-engine';

// Store active simulations
const activeSimulations = new Map<string, RealtimeSimulationEngine>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const testCaseId = searchParams.get('testCaseId');
  const action = searchParams.get('action');

  if (!testCaseId) {
    return NextResponse.json({ error: 'Test case ID is required' }, { status: 400 });
  }

  try {
    const supabase = createClient();
    
    // Get user from request (you'll need to implement proper auth)
    const userId = 'user-id'; // Replace with actual user ID from auth

    switch (action) {
      case 'initialize':
        return await initializeSimulation(testCaseId, userId);
      
      case 'start':
        return await startSimulation(testCaseId);
      
      case 'pause':
        return await pauseSimulation(testCaseId);
      
      case 'resume':
        return await resumeSimulation(testCaseId);
      
      case 'stop':
        return await stopSimulation(testCaseId);
      
      case 'reset':
        return await resetSimulation(testCaseId);
      
      case 'status':
        return await getSimulationStatus(testCaseId);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Simulation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testCaseId, action, data } = body;

    if (!testCaseId || !action) {
      return NextResponse.json({ error: 'Test case ID and action are required' }, { status: 400 });
    }

    switch (action) {
      case 'setSpeed':
        return await setSimulationSpeed(testCaseId, data.speed);
      
      case 'jumpToTime':
        return await jumpToTime(testCaseId, data.time);
      
      case 'setFilters':
        return await setSimulationFilters(testCaseId, data.filters);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Simulation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function initializeSimulation(testCaseId: string, userId: string) {
  try {
    // Check if simulation already exists
    if (activeSimulations.has(testCaseId)) {
      return NextResponse.json({ 
        success: true, 
        message: 'Simulation already initialized',
        simulationId: testCaseId 
      });
    }

    // Create new simulation engine
    const simulation = new RealtimeSimulationEngine();
    
    // Initialize with test case data
    await simulation.initializeSimulation(testCaseId);
    
    // Store simulation
    activeSimulations.set(testCaseId, simulation);
    
    // Get initial state
    const state = simulation.getState();
    
    return NextResponse.json({
      success: true,
      message: 'Simulation initialized successfully',
      simulationId: testCaseId,
      state
    });
  } catch (error) {
    console.error('Failed to initialize simulation:', error);
    return NextResponse.json({ error: 'Failed to initialize simulation' }, { status: 500 });
  }
}

async function startSimulation(testCaseId: string) {
  const simulation = activeSimulations.get(testCaseId);
  if (!simulation) {
    return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
  }

  simulation.start();
  const state = simulation.getState();
  
  return NextResponse.json({
    success: true,
    message: 'Simulation started',
    state
  });
}

async function pauseSimulation(testCaseId: string) {
  const simulation = activeSimulations.get(testCaseId);
  if (!simulation) {
    return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
  }

  simulation.pause();
  const state = simulation.getState();
  
  return NextResponse.json({
    success: true,
    message: 'Simulation paused',
    state
  });
}

async function resumeSimulation(testCaseId: string) {
  const simulation = activeSimulations.get(testCaseId);
  if (!simulation) {
    return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
  }

  simulation.resume();
  const state = simulation.getState();
  
  return NextResponse.json({
    success: true,
    message: 'Simulation resumed',
    state
  });
}

async function stopSimulation(testCaseId: string) {
  const simulation = activeSimulations.get(testCaseId);
  if (!simulation) {
    return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
  }

  simulation.stop();
  const state = simulation.getState();
  
  return NextResponse.json({
    success: true,
    message: 'Simulation stopped',
    state
  });
}

async function resetSimulation(testCaseId: string) {
  const simulation = activeSimulations.get(testCaseId);
  if (!simulation) {
    return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
  }

  simulation.reset();
  const state = simulation.getState();
  
  return NextResponse.json({
    success: true,
    message: 'Simulation reset',
    state
  });
}

async function getSimulationStatus(testCaseId: string) {
  const simulation = activeSimulations.get(testCaseId);
  if (!simulation) {
    return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
  }

  const state = simulation.getState();
  
  return NextResponse.json({
    success: true,
    state
  });
}

async function setSimulationSpeed(testCaseId: string, speed: number) {
  const simulation = activeSimulations.get(testCaseId);
  if (!simulation) {
    return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
  }

  simulation.setSpeed(speed);
  const state = simulation.getState();
  
  return NextResponse.json({
    success: true,
    message: `Speed set to ${speed}x`,
    state
  });
}

async function jumpToTime(testCaseId: string, time: number) {
  const simulation = activeSimulations.get(testCaseId);
  if (!simulation) {
    return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
  }

  simulation.jumpToTime(time);
  const state = simulation.getState();
  
  return NextResponse.json({
    success: true,
    message: `Jumped to time ${time}ms`,
    state
  });
}

async function setSimulationFilters(testCaseId: string, filters: any) {
  const simulation = activeSimulations.get(testCaseId);
  if (!simulation) {
    return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
  }

  simulation.setFilters(filters);
  const state = simulation.getState();
  
  return NextResponse.json({
    success: true,
    message: 'Filters updated',
    state
  });
}

// WebSocket endpoint for real-time streaming
export async function WebSocket(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const testCaseId = searchParams.get('testCaseId');

  if (!testCaseId) {
    return new Response('Test case ID is required', { status: 400 });
  }

  const simulation = activeSimulations.get(testCaseId);
  if (!simulation) {
    return new Response('Simulation not found', { status: 404 });
  }

  // Create WebSocket connection
  const { socket, response } = Deno.upgradeWebSocket(request);
  
  // Set up event listeners
  simulation.on('message', (message: SimulationMessage) => {
    socket.send(JSON.stringify({
      type: 'message',
      data: message
    }));
  });

  simulation.on('kpi', (kpis: SimulationKPIs) => {
    socket.send(JSON.stringify({
      type: 'kpi',
      data: kpis
    }));
  });

  simulation.on('progress', (progress: number) => {
    socket.send(JSON.stringify({
      type: 'progress',
      data: { progress }
    }));
  });

  simulation.on('complete', () => {
    socket.send(JSON.stringify({
      type: 'complete',
      data: { message: 'Simulation completed' }
    }));
  });

  simulation.on('error', (error: Error) => {
    socket.send(JSON.stringify({
      type: 'error',
      data: { error: error.message }
    }));
  });

  socket.onopen = () => {
    console.log('WebSocket connection opened for simulation:', testCaseId);
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed for simulation:', testCaseId);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error for simulation:', testCaseId, error);
  };

  return response;
}