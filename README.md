# easy-telegram

## example of code that checks if the date is valid

```
	const bot = new SimpleBot("BOT TOKEN HERE", {
		opap: {
			func: (msg, args, sendMessage) =>
				sendMessage(
					"This text will be sended on /opap command. With keyboard below",
					SimpleBot.MarkupContsrtuctor.InlineKeyboard(
						[1, 2, 3].map((e) => ({
							text: e,
							callback_data: e,
							callback: (text) => sendMessage(`Choosen ${text}`),
							onNextMessage: (callback_data, text) => {
								try {
									if (
										!/^(3[01]|[12][0-9]|0[1-9]).(1[0-2]|0[1-9]).[0-9]{2}$/.test(text) &&
										!/^(3[01]|[12][0-9]|0[1-9]).(1[0-2]|0[1-9]).[0-9]{4}$/.test(text)
									) {
										sendMessage("Invalid Date")
                                        //Return false to let you re-enter the date
										return false
									}

									const dateParams = text.split(".")
									const year = dateParams[2]?.length < 4 ? "20" + dateParams[2] : dateParams[2]
									const month = dateParams[1] - 1
									const date = new Date(year, month, dateParams[0], 0, 0, 0)

									sendMessage(`You enter: ${new Date(date).toLocaleDateString()} для ${callback_data}`)
									if (!isNaN(d)) {
										sendMessage("Success")
                                        //Return true to break enter
										return true
									} else {
										sendMessage("Try again")
                                        //Return false to let you re-enter the date
										return false
									}
								} catch (e) {
                                    sendMessage("Smth went wrong")
                                    //Return false to let you re-enter the date
									return false
								}
							},
						})),
					),
				),
		},
	})
```
