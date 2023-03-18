import TelegramBot from "node-telegram-bot-api"
import parseCommand from "./utils/parseCommand"

export function SimpleBot(token, commands = {}) {
	const bot = new TelegramBot(token, {polling: true})

	bot.on("message", (msg) => {
		console.log("msg", msg)
		const reply = (text) => {
			try {
				bot.sendMessage(msg.chat.id, text).catch((e) => {
					console.error("reply error", e.toString())
					bot.sendMessage(msg.chat.id, `Произошла ошибка ${e?.toString()}`)
				})
			} catch (e) {
				console.error("reply error", e)
				bot.sendMessage(msg.chat.id, `Ошибка отправки ошибки ${e.toString()}`)
			}
		}

		try {
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

			bot.sendMessage(msg.chat.id, msg.text)
		} catch (e) {
			console.error("error", e)
			reply(`Произошла ошибка ${e?.toString()}`)
		}
	})
}
