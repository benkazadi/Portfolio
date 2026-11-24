export const BANDS = [
    {
		id: 'piano', name: 'Piano', level: 0.79, seed: 1, status: 'strong',
		tools: [],
		proof: [],
	},
    {
		id: 'chess', name: 'Chess', level: 0.60, seed: 0.2, status: 'strong',
		tools: [],
		proof: [],
	},
	{
		id: 'frontend', name: 'Frontend', level: 0.85, seed: 0.1, status: 'strong',
		tools: ['React', 'JavaScript', 'CSS', 'HTML', 'Three.js', 'Vite'],
		proof: ['SIGNAL/LOST', 'Acadaily', 'Sovereign'],
	},
	{
		id: 'backend', name: 'Backend', level: 0.75, seed: 0.35, status: 'stable',
		tools: ['Node.js', 'Express', 'Socket.io', 'WebSockets', 'REST APIs'],
		proof: ['ACE', 'IRIS', 'WaveShare', 'Sovereign'],
	},
	{
		id: 'systems', name: 'Systems', level: 0.58, seed: 0.6, status: 'growing',
		tools: ['Linux (Arch + Hyprland)', 'Shell', 'Networking', 'C++'],
		proof: ['WaveShare', 'Arch rebuild'],
	},
	{
		id: 'ai', name: 'AI / Local tools', level: 0.55, seed: 0.8, status: 'acquiring',
		tools: ['Ollama', 'Local LLMs', 'Tool calling', 'Prompting'],
		proof: ['IRIS'],
	},
	{
		id: 'games', name: 'Game dev', level: 0.32, seed: 0.5, status: 'early signal',
		tools: ['Godot', 'GDScript', 'Multiplayer logic'],
		proof: ['Sovereign'],
	},
	{
		id: 'security', name: 'Security', level: 0.28, seed: 0.9, status: 'learning',
		tools: ['Network fundamentals', 'Hands-on practice on my own gear'],
		proof: [],
	},
];
