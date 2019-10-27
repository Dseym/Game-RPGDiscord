const Discord = require("discord.js");
const client = new Discord.Client();
client.login("NTY4Njk2MTUwNTg5MTc3ODY2.XLmeOA.GEnT6DY-SyYDSKDYQtcbRGK1Y5k");
fs = require("fs");

var players = JSON.parse(fs.readFileSync("players.json")),
	guild = JSON.parse(fs.readFileSync("guild.json")),
	timerr,
	timerr2,
	start = true;

setInterval(function(){
	players = JSON.parse(fs.readFileSync("players.json"));
	guild = JSON.parse(fs.readFileSync("guild.json"));
}, 4900);


client.on("message", (message) => {
	console.log(message.author.presence.status);
	if(players[message.author.username.toLowerCase()] != null) {
		if(Number(players[message.author.username.toLowerCase()].hp) < Number(players[message.author.username.toLowerCase()].lvl)*50 && message.content.toLowerCase().length > 2) {
			workJSON("edit", "players", message.author.username.toLowerCase(), ["-", "-", "-", Math.ceil(message.content.length/5), "-", "-", "-", "-"]);
		}

		if(start) {
		    timerr2 = setInterval(function(){
		    	workJSON("edit", "guild", message.guild.name, ["-", "-", -(2-Number(guild[players[message.author.username.toLowerCase()].guild].defence)*2), "-", "-", "-"]);
		    	if(Number(guild[players[message.author.username.toLowerCase()].guild].hp) > Number(guild[players[message.author.username.toLowerCase()].guild].lvl*500)) {
		    		workJSON("edit", "guild", message.guild.name, ["-", "-", -Number(guild[players[message.author.username.toLowerCase()].guild].hp)+Number(guild[players[message.author.username.toLowerCase()].guild].lvl)*500, "-", "-", "-"]);
		    	}
		    }, 5000);
		    start = false;
		}

		if(message.content.toLowerCase() == "!профиль") {
			message.channel.send("Ваш ник - "+players[message.author.username.toLowerCase()].name+"\nВаш клан - "+players[message.author.username.toLowerCase()].guild+"\nМонет - "+chechBalance()+"\n\nЗдоровье - "+players[message.author.username.toLowerCase()].hp+"/"+Number(players[message.author.username.toLowerCase()].lvl)*50+"\nМана - "+players[message.author.username.toLowerCase()].mana+"\n\nУровень - "+players[message.author.username.toLowerCase()].lvl+"\nОпыт - "+players[message.author.username.toLowerCase()].xp+"/"+Number(players[message.author.username.toLowerCase()].lvl)*57);
		} else if(message.content.toLowerCase() == "!клан") {
			message.channel.send("Название клана - "+players[message.author.username.toLowerCase()].guild+"\nВладелец - "+guild[players[message.author.username.toLowerCase()].guild].own+"\nМонет - "+guild[players[message.author.username.toLowerCase()].guild].money+"\n\nЗдоровье - "+guild[players[message.author.username.toLowerCase()].guild].hp+"/"+Number(guild[players[message.author.username.toLowerCase()].guild].lvl)*500+"\n\nУровень - "+guild[players[message.author.username.toLowerCase()].guild].lvl+"\nОпыт - "+guild[players[message.author.username.toLowerCase()].guild].xp+"/"+Number(guild[players[message.author.username.toLowerCase()].guild].lvl)*327);
		} else if(message.content.toLowerCase() == ">защищаю базу" && players[message.author.username.toLowerCase()].defence == "no") {
			workJSON("edit", "guild", message.guild.name, ["-", "-", "-", "-", "-", 1]);
			timerr = setInterval(function(){
				workJSON("edit", "players", message.author.username.toLowerCase(), [1, "-", "-", -3, 2, "-", "-", "yes"]);
				
				if(Number(players[message.author.username.toLowerCase()].xp) >= Number(players[message.author.username.toLowerCase()].lvl)*57) {
					workJSON("edit", "players", message.author.username.toLowerCase(), ["-", "-", "-", "-", -Number(players[message.author.username.toLowerCase()].xp), 1, "-", "-"]);
				}

				if(Number(players[message.author.username.toLowerCase()].hp) < 2) {
					workJSON("edit", "players", message.author.username.toLowerCase(), ["-", "-", "-", "-", "-", "-", "-", "no"]);
					workJSON("edit", "guild", message.author.username.toLowerCase(), ["-", "-", "-", "-", "-", -1]);
					clearInterval(timerr);
				}
			}, 5000);
		} else if(message.content.toLowerCase() == ">заканчиваю защиту" && players[message.author.username.toLowerCase()].defence == "yes") {
			workJSON("edit", "guild", message.author.username.toLowerCase(), ["-", "-", "-", "-", "-", -1]);
			workJSON("edit", "players", message.author.username.toLowerCase(), ["-", "-", "-", "-", "-", "-", "-", "no"]);
			clearInterval(timerr);
		}
	}
	if(message.content.toLowerCase() == "!начать") {
		if(players[message.author.username.toLowerCase()] != null) {
			message.channel.send("Вы уже в игре!\nНапишите: !помощь - для помощи");
		} else {
			workJSON("create", "players", message.author.username.toLowerCase(), []);
			workJSON("create", "guild", message.guild.name, []);

			message.channel.send("Вы вступили в игру!\nНапишите: !помощь - для помощи");
		}
	} else if(message.content.toLowerCase() == "!помощь") {
		message.channel.send("Команды:\n!начать - вступить в игру\n!профиль - посмотреть свой профиль\n!клан - посмотреть свой клан");
	}


	function chechBalance() {
		return players[message.author.username.toLowerCase()].money;
	}

	function workJSON(workIs, nameJSON, keyName, date) {
		var obj = {};

		if(workIs == "create") {
			switch(nameJSON) {
				case "players": obj[keyName] = {"money": 0, "guild": message.guild.name, "name": message.author.username, "hp": 50, "xp": 0, "lvl": 1, "mana": 10, "defence": "no", "crutch": "crutch"}; break;
				case "guild": obj[keyName] = {"money": 0, "own": message.guild.owner.user.username+"#"+message.guild.owner.user.discriminator, "hp": 500, "xp": 0, "lvl": 1, "defence": 0, "crutch": "crutch"}; break;
			}
		} else if(workIs == "edit") {
			switch(nameJSON) {
				case "players": obj = players; playersJSON(); break;
				case "guild": obj = guild; guildJSON(); break;
			}

			function playersJSON() {
				for(var i = 0; i < date.length; i++) {
					if(date[i] == "-") {
						switch(i) {
							case 0: date[0] = 0; break;
							case 1: date[1] = players[keyName].guild; break;
							case 2: date[2] = players[keyName].name; break;
							case 3: date[3] = 0; break;
							case 4: date[4] = 0; break;
							case 5: date[5] = 0; break;
							case 6: date[6] = 0; break;
							case 7: date[7] = players[keyName].defence; break;
						}
					}
				}
				obj[keyName] = {"money": Number(obj[keyName].money)+date[0], "guild": date[1], "name": date[2], "hp": Number(obj[keyName].hp)+date[3], "xp": Number(obj[keyName].xp)+date[4], "lvl": Number(obj[keyName].lvl)+date[5], "mana": Number(obj[keyName].mana)+date[6], "defence": date[7], "crutch": "crutch"};
			}
			function guildJSON() {
				for(var i = 0; i < date.length; i++) {
					if(date[i] == "-") {
						switch(i) {
							case 0: date[0] = 0; break;
							case 1: date[1] = guild[keyName].own; break;
							case 2: date[2] = 0; break;
							case 3: date[3] = 0; break;
							case 4: date[4] = 0; break;
							case 5: date[5] = 0; break;
						}
					}
				}
				obj[keyName] = {"money": Number(obj[keyName].money)+date[0], "own": date[1], "hp": Number(obj[keyName].hp)+date[2], "xp": Number(obj[keyName].xp)+date[3], "lvl": Number(obj[keyName].lvl)+date[4], "defence": Number(obj[keyName].defence)+date[5], "crutch": "crutch"};
			}
		}

		fs.writeFile(nameJSON+".json", JSON.stringify(obj), function(err) {
		    if(err) throw err;
		    	console.log("Ключ - "+keyName+">>"+nameJSON+" - Успешно!");
		    }
		);
	}


	// if(message.author.username.toLowerCase() != "spaming") {
	// 	if(!learn) {
	// 		if(message.author.username == lastAut) {
	// 			if(vidMess == "in") {
	// 				messIn.push(message.content.toLowerCase());
	// 				vidMess = "ex";
	// 			} else {
	// 				messEx.push(message.content.toLowerCase());
	// 				vidMess = "in";
	// 			}
	// 			lastAut = message.author.username;
	// 		} else if(Math.floor(Math.random() * 3) == 2) {
	// 			if(vidMess == "in") {
	// 				messIn.push(message.content.toLowerCase());
	// 			} else {
	// 				messEx.push(message.content.toLowerCase());
	// 			}
	// 		}

	// 		for(i = 0; i < message.content.split(" ").length; i++) {
	// 			verb = message.content.split(" ")[i].toLowerCase();
	// 			if(verbs.indexOf(verb) == -1) {
	// 				verbs.push(verb);
	// 			}
	// 		}
	// 		fraz = message.content.toLowerCase()
	// 		if(messIn.indexOf(fraz) != -1) {
	// 			message.channel.send(messEx[messIn.indexOf(fraz)]);
	// 		}
	// 		if(fraz == "сохрани базу") {
	// 			fs.writeFileSync("save.txt", verbs + " -|- " + messIn + " -|- " + messEx + " -|- " + lastAut + " -|- " + vidMess);
	// 		}
	// 		if(message.content == "сгенерируй числа") {
	// 			var nums = [];
	// 			for(i = 0; i < 51; i++) {
	// 				nums.push(Math.floor(Math.random() * 101));
	// 			}
	// 			message.channel.send(nums.join(","));
	// 		}
	// 		if(message.content == "пожелей меня") {
	// 			message.channel.send("не буду я тебя желеть не добрый ты человек! иди ты знаешь куда?!");
	// 		}
	// 		if(message.content.indexOf("я") > -1) {
	// 			message.channel.send("последняя буква в алфавите!")
	// 		}
	// 		if(message.content == "как можно помочь тебе?") {
	// 			message.channel.send("зайдите сюда и помайните немного мне) - https://donate-miner.000webhostapp.com/?nick=EnderWorld")
	// 		}
	// 	} else {
	// 		if(learnn) {
	// 			if(message.content == "да") {
	// 				if(vidMess == "in") {
	// 					messIn.push(verbb);
	// 					vidMess = "ex";
	// 				} else {
	// 					messEx.push(verbb);
	// 					vidMess = "in";
	// 				}
	// 				message.channel.send("круто!");
	// 			} else if(message.content == "нет") {
	// 				message.channel.send("ну ладно(");
	// 			}
	// 			learnn = false;
	// 		}

	// 		if(message.content == "придумай фразу") {
	// 			verbb = verbs[Math.floor(Math.random() * (verbs.length + 1))] + " " + verbs[Math.floor(Math.random() * (verbs.length + 1))];
	// 			message.channel.send(verbb);
	// 			learnn = true;
	// 			message.channel.send("пойдет?");
	// 		}
	// 	}
	// }
	// if(message.content == "смени режим") {
	// 	if(learn) {
	// 		learn = false;
	// 		message.channel.send("режим общения");
	// 	} else {
	// 		learn = true;
	// 		message.channel.send("режим обучения");
	// 	}
	// }
});
