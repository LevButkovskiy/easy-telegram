export default function parseCommand(text) {
	const args = (text || "").slice(1).trim().split(/ +/g)
	const command = args.shift().toLowerCase()
	return command
}
