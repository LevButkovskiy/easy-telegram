import TelegramBot from "node-telegram-bot-api"
import parseCommand from "./utils/parseCommand"

let callbacks = []
function SimpleBot(token, commands = {}) {
	const bot = new TelegramBot(token, {polling: true})

	bot.on("message", (msg) => {
		console.log("msg", msg)
		const reply = async (text, ...props) => {
			try {
				console.log("props", props)

				const res = await bot.sendMessage(msg.chat.id, text, ...props).catch((e) => {
					console.error("reply error", e.toString())
					bot.sendMessage(msg.chat.id, `Произошла ошибка ${e?.toString()}`)
				})
				// const json = await res.json()
				console.log("res", res)
				props.forEach((prop) => {
					console.log("prop", prop)
					const keyboard = JSON.parse(prop?.reply_markup)?.inline_keyboard.flat(2)
					console.log("keyboard", keyboard)
					keyboard.map((e) => callbacks.push({msgId: res.message_id, func: e.func}))
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

				console.log("command", command)
				return command.func ? command.func(msg, args, reply) : reply(command.description || "Команда не настроена")
			}

			bot.sendMessage(msg.chat.id, msg.text)
		} catch (e) {
			console.error("error", e)
			reply(`Произошла ошибка ${e?.toString()}`)
		}
	})
	bot.call
	bot.on("callback_query", (msg) => {
		console.log("callback", msg)
		console.log(callbacks)
		const callback = callbacks.find((callback) => callback.msgId === msg?.message?.message_id)
		console.log("callback func", callback)
		if (!callback) return
		callback.func(msg.data)
	})
}

SimpleBot.MarkupContsrtuctor = {
	InlineKeyboard: (args) => ({reply_markup: {inline_keyboard: args}}),
}

export default SimpleBot
