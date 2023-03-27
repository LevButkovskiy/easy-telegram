import SimpleBot from "."

function init() {
	const bot = new SimpleBot("6139930516:AAGd7JHussqKhP1nU5Ixt21CrXfW5_ABXuw", {
		opap: {
			func: (msg, args, sendMessage) => {
				sendMessage(
					"Works",
					SimpleBot.MarkupContsrtuctor.InlineKeyboard([
						[1, 2, 3].map((e) => ({
							text: e,
							callback_data: e,
							func: {
								b: 2,
								a: (text) => console.log("WORKS", text),
							},
						})),
					]),
				)
			},
		},
	})
}

init()
