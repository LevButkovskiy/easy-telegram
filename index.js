import _ from "lodash"
import TelegramBot from "node-telegram-bot-api"
import commandHandler from "./src/commandHandler"
import parseCommand from "./utils/parseCommand"

let callbacks = []
let nextMessage = {}

function SimpleBot(token, commands = {}) {
	const bot = new TelegramBot(token, {polling: true})

	bot.on("message", (msg) => {
		console.log(msg)
		const reply = async (text, ...props) => {
			try {
				const copy = _.cloneDeep(props)
				const res = await bot.sendMessage(msg.chat.id, text, ...props).catch((e) => {
					console.error("reply error", e.toString())
					bot.sendMessage(msg.chat.id, `Произошла ошибка ${e?.toString()}`)
				})
				copy.forEach((prop) => {
					const keyboardKey = Object.keys(prop?.reply_markup || {})[0]
					const keyboard = prop.reply_markup[keyboardKey]?.flat(2)
					keyboard.map((e) => {
						console.log(e)
						if (e.callback) callbacks.push({msgId: res.message_id, callback: e.callback})
						if (e.onNextMessage) nextMessage[msg.chat.id] = {callback_data: e.callback_data, callback: e.onNextMessage}
					})
				})
			} catch (e) {
				console.error("reply error", e)
				bot.sendMessage(msg.chat.id, `Ошибка отправки ошибки ${e.toString()}`)
			}
		}

		if (nextMessage[msg.chat.id]) {
			console.log(nextMessage)
			const success = nextMessage[msg.chat.id]?.callback(nextMessage[msg.chat.id]?.callback_data, msg.text)
			if (success) delete nextMessage[msg.chat.id]
		}

		try {
			commandHandler(msg, commands, reply)
		} catch (e) {
			console.error("error", e)
			reply(`Произошла ошибка ${e?.toString()}`)
		}
	})
	bot.on("callback_query", (msg) => {
		const callback = callbacks.find((callback) => callback.msgId === msg?.message?.message_id)
		callback?.callback(msg.data)
		if (!callback) return
		callback.func(msg.data)
	})
}

SimpleBot.MarkupContsrtuctor = {
	InlineKeyboard: (args) => ({reply_markup: {inline_keyboard: [args.flat(Infinity)]}}),
	ReplyKeyboard: (args) => ({reply_markup: {keyboard: [args.flat(Infinity)]}}),
}

export default SimpleBot
