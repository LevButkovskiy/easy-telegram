import parseCommand from "../utils/parseCommand"

export default function commandHandler(msg, commands, reply) {
	if ((msg.text || msg.caption || "").startsWith("/")) {
		const args = (msg.text || "").slice(1).trim().split(/ +/g)

		const name = parseCommand(msg.text)
		const command = commands[name]

		if (name === "help") {
			return reply(
				"Список команд: \n" +
					Object.keys(commands)
						.map((name) => `/${name} - ${commands[name].description || "Описание не задано"}`)
						.join("\n"),
			)
		}

		if (!commands[name]) return reply("Команда не найдена. Список всех команд /help")
		return command.func ? command.func(msg, args, reply) : reply(command.description || "Команда не настроена")
	}
}
