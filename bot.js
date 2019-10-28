const Discord = require("discord.js");
const client = new Discord.Client();
client.login("NTY4Njk2MTUwNTg5MTc3ODY2.Xbaaug.HeAOC7q3u6mwvVGlwhHZc5Wg1h0");
fs = require("fs");
workJSON = require("jsonFunc");

var players = JSON.parse(fs.readFileSync("jsonFiles/players.json")),
	guild = JSON.parse(fs.readFileSync("jsonFiles/guild.json")),
	items = JSON.parse(fs.readFileSync("jsonFiles/items.json")),
	timerr,
	timerr2,
	jsons = [players, guild, items],
	start = true;

setInterval(function(){
	players = JSON.parse(fs.readFileSync("jsonFiles/players.json"));
	guild = JSON.parse(fs.readFileSync("jsonFiles/guild.json"));
	items = JSON.parse(fs.readFileSync("jsonFiles/items.json"));
	jsons = [players, guild, items];
}, 4900);


client.on("message", (message) => {
	if(players[message.author.username.toLowerCase()] != null && message.guild != null) {
		if(Number(players[message.author.username.toLowerCase()].hp) < Number(players[message.author.username.toLowerCase()].lvl)*50 && message.content.toLowerCase().length > 2) {
			workJSON(jsons, "edit", "players", message.author.username.toLowerCase(), ["-", "-", "-", Math.ceil(message.content.length/5), "-", "-", "-", "-"]);
		}

		if(start) {
		    timerr2 = setInterval(function(){
		    	workJSON(jsons, "edit", "guild", message.guild.name, ["-", "-", -(2-Number(guild[players[message.author.username.toLowerCase()].guild].defence)*2), "-", "-", "-"]);
		    	if(Number(guild[players[message.author.username.toLowerCase()].guild].hp) > Number(guild[players[message.author.username.toLowerCase()].guild].lvl*500)) {
		    		workJSON(jsons, "edit", "guild", message.guild.name, ["-", "-", -Number(guild[players[message.author.username.toLowerCase()].guild].hp)+Number(guild[players[message.author.username.toLowerCase()].guild].lvl)*500, "-", "-", "-"]);
		    	}
		    }, 5000);
		    start = false;
		}

		if(message.content.toLowerCase() == "!профиль") {
			message.author.sendMessage("Ваш ник - "+players[message.author.username.toLowerCase()].name+"\nВаш клан - "+players[message.author.username.toLowerCase()].guild+"\nМонет - "+chechBalance()+"\n\nЗдоровье - "+players[message.author.username.toLowerCase()].hp+"/"+Number(players[message.author.username.toLowerCase()].lvl)*50+"\nМана - "+players[message.author.username.toLowerCase()].mana+"\n\nУровень - "+players[message.author.username.toLowerCase()].lvl+"\nОпыт - "+players[message.author.username.toLowerCase()].xp+"/"+Number(players[message.author.username.toLowerCase()].lvl)*57);
		} else if(message.content.toLowerCase() == "!клан") {
			message.channel.send("Название клана - "+players[message.author.username.toLowerCase()].guild+"\nВладелец - "+guild[players[message.author.username.toLowerCase()].guild].own+"\nМонет - "+guild[players[message.author.username.toLowerCase()].guild].money+"\n\nЗдоровье - "+guild[players[message.author.username.toLowerCase()].guild].hp+"/"+Number(guild[players[message.author.username.toLowerCase()].guild].lvl)*500+"\n\nУровень - "+guild[players[message.author.username.toLowerCase()].guild].lvl+"\nОпыт - "+guild[players[message.author.username.toLowerCase()].guild].xp+"/"+Number(guild[players[message.author.username.toLowerCase()].guild].lvl)*327);
		} else if(message.content.toLowerCase() == "/защита" && players[message.author.username.toLowerCase()].defence == "no") {
			workJSON(jsons, "edit", "guild", message.guild.name, ["-", "-", "-", "-", "-", 1]);
			workJSON(jsons, "edit", "players", message.author.username.toLowerCase(), ["-", "-", "-", "-", "-", "-", "-", "yes"]);
			timerr = setInterval(function(){
				var randItem = Math.floor(Math.random()*5);
				if(randItem == 0) {
					workJSON(jsons, "edit", "items", message.author.username.toLowerCase(), ["add", "железо"]);
				} else if(randItem == 1) {
					workJSON(jsons, "edit", "items", message.author.username.toLowerCase(), ["add", "дерево"]);
				} else if(randItem == 2) {
					workJSON(jsons, "edit", "items", message.author.username.toLowerCase(), ["add", "золото"]);
				} else {
					workJSON(jsons, "edit", "players", message.author.username.toLowerCase(), [1, "-", "-", -3, 2, "-", "-", "yes"]);
				}
				
				if(Number(players[message.author.username.toLowerCase()].xp) >= Number(players[message.author.username.toLowerCase()].lvl)*57) {
					workJSON(jsons, "edit", "players", message.author.username.toLowerCase(), ["-", "-", "-", "-", -Number(players[message.author.username.toLowerCase()].xp), 1, "-", "-"]);
				}

				if(Number(players[message.author.username.toLowerCase()].hp) < 2) {
					clearInterval(timerr);
					workJSON(jsons, "edit", "players", message.author.username.toLowerCase(), ["-", "-", "-", "-", "-", "-", "-", "no"]);
					workJSON(jsons, "edit", "guild", message.author.username.toLowerCase(), ["-", "-", "-", "-", "-", -1]);
				}
			}, 5100);
		} else if(message.content.toLowerCase() == "/закончить защиту" && players[message.author.username.toLowerCase()].defence == "yes") {
			clearInterval(timerr);
			setTimeout(function() {
				workJSON(jsons, "edit", "guild", message.guild.name, ["-", "-", "-", "-", "-", -1]);
				workJSON(jsons, "edit", "players", message.author.username.toLowerCase(), ["-", "-", "-", "-", "-", "-", "-", "no"]);
			}, 300);
		} else if(message.content.toLowerCase() == "!плавильня") {
			message.author.sendMessage("Для создания предмета пишите сюда и используйте такую форму сообщения:\n>создать .предмет.(предметы для создания...)\nПример: >создать меч(железо, золото, дерево)");
			message.author.sendMessage(":Предметов для создания: у каждого предмета:\nМеч = 3");
		} else if(message.content.toLowerCase() == "!инвентарь") {
			var inv = "",
				nick = message.author.username.toLowerCase();
			for(var i = 0; i < items[nick].length; i++) {
				inv += "\n"+items[nick][i]+";";
			}
			message.author.sendMessage("Ваши вещи:"+inv);
		}
	} else if(players[message.author.username.toLowerCase()] != null && message.guild == null) {
		if(message.content.toLowerCase().indexOf(">создать ") > -1) {
			var item = message.content.toLowerCase().split(">создать ")[1].split("(")[0],
				itemsForItem = message.content.toLowerCase().split("(")[1].split(")")[0],
				nick = message.author.username.toLowerCase(),
				itemsForRemove = [],
				canCreate = true;
			for(var i = 0; i < itemsForItem.split(", ").length; i++) {
				var yes = true;
				for(var ii = 0; ii < items[nick].length; ii++) {
					if(items[nick][ii] == itemsForItem.split(", ")[i]) {
						yes = false;
						itemsForRemove.push(items[nick][ii]);
					}
				}
				if(yes) {
					message.channel.send("Предмета: "+itemsForItem.split(",")[i]+" - нету у Вас в инвентаре");
					canCreate = false;
					itemsForRemove = [];
					break;
				}
			}
			if(canCreate) {
				for(var i = 0; i < itemsForRemove.length; i++) {
					workJSON(jsons, "edit", "items", message.author.username.toLowerCase(), ["delete", itemsForRemove[i]]);
				}
				if(item == "меч" && itemsForItem.split(",").length == 3) {
					workJSON(jsons, "edit", "items", message.author.username.toLowerCase(), ["add", item+"("+itemsForItem+")"]);
					message.channel.send("Предмет: "+message.content.toLowerCase().split(">создать ")[1].split("(")[0]+" - успешно создан!");
				} else {
					message.channel.send("Предмета: "+item+" - не существует в игре!\nЛибо Вы ввели неверное количество :предметов для создания:");
				}
			}
		}
	}

	if(message.content.toLowerCase() == "!начать") {
		if(players[message.author.username.toLowerCase()] != null) {
			message.channel.send("Вы уже в игре!\nНапишите: !помощь - для помощи");
		} else {
			workJSON(jsons, "create", "players", message.author.username.toLowerCase(), []);
			workJSON(jsons, "create", "guild", message.guild.name, []);
			workJSON(jsons, "create", "items", message.author.username.toLowerCase(), []);

			message.channel.send("Вы вступили в игру!\nНапишите: !помощь - для помощи");
		}
	} else if(message.content.toLowerCase() == "!помощь") {
		message.channel.send("Команды:\n!начать - вступить в игру\n!профиль - посмотреть свой профиль\n!клан - посмотреть свой клан\n!плавильня - создать какой-либо предмет\n!инвентарь - посмотреть свой инвентарь\n!действия - помощь по действиям клана");
	} else if(message.content.toLowerCase() == "!действия") {
		message.channel.send("Действия с кланом:\n/защита - начать защиту клана\n/закончить защиту - закончить защиту клана");
	}


	function chechBalance() {
		return players[message.author.username.toLowerCase()].money;
	}
});
