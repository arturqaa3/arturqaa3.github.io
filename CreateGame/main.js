class GameCards{
    weight;
    type;
    name;
};

let CardsDeck = []; // ОБЩАЯ КОЛОДА
let EnemyCardsArray = []; // ВРАЖЕСКАЯ КОЛОДА
let MyCardsArray = []; // МОЯ КОЛОДА
let IsMyAttack = true; // СЕЙЧАС МОЯ АТАКА
let AttackCard; // Моя АТАКУЮЩАЯ КАРТА
let Enemy_AttackCard; // АТАКУЮЩАЯ КАРТА Противника
let Enemy_GoalKeeper;//Вратарь Противника
let Enemy_LeftDefender;//Левый защитник Противника
let Enemy_MidleDefender;//Центральный защитник Противника
let Enemy_RightDefender;// Правый защитник Противника
let My_GoalKeeper;//Мой Вратарь
let My_LeftDefender;//Мой Левый защитник 
let My_MidleDefender;//Мой Центральный защитник 
let My_RightDefender;// Мой Правый защитник 
let enemyDef = [];// Защита противника
let MyDef = [];// Моя защита
let curren_pressedcard;//Текущая прожатая карта
let Extraction = [];//Добыча
let Score = [0,0];
let image_width = '4.9vw';
let image_height = '8vw';
let press_style = "background-color: rgba(255, 0, 0, 0.5);";
let EnemyCardsArrayCount_span;//счетчик колоды противника
let MyCardsArrayCount_span;//счетчик моей колоды
let EqualCaseHelpers = [];//Помощники при равенстве карт

function GetCardsArray(){ // ПОЛУЧИТЬ ОБЩУЮ КОЛОДУ
    let CardsArray = [];
    let type_arr = ['Крести','Буби','Черви','Пики'];
    let cards_name = ['Валет','Дама','Король','Туз']
    
    for(let i=6;i < 15; i++ )
    {
        for(let item of type_arr)
        {
            let newCard = new GameCards();
            newCard.weight = i;
            newCard.type = item;
            if(i<11)
            {
                newCard.name = `${i} ${item}`;
            }
            else
            {
                let index = i - 11;
                newCard.name = `${cards_name[index]} ${item}`;
            }
            CardsArray.push(newCard)
        }
    }
    return CardsArray;
}

document.addEventListener('DOMContentLoaded', () => { //ДОЖДАТЬСЯ ПОКА ЗАГРУЗИТСЯ ФОРМА
    StartGame();
});

function StartGame(value) { // ЗАПУСК ИГРЫ ПОСЛЕ ЗАГРУЗКИ (раскидать колоду)
    CardsDeck = GetCardsArray();
    EnemyCardsArray = [];
    MyCardsArray = [];
    IsMyAttack = true;
    AttackCard = undefined;
    
    let deck = CardsDeck;
    for(let i = 0; i < CardsDeck.length / 2; i++)
    {
        let index = Math.ceil(Math.random() * 100) % deck.length;
        let item = deck[index];
        EnemyCardsArray.push(item);
        deck = deck.filter(c => c.name !== item.name);
        index = Math.ceil(Math.random() * 100) % deck.length;
        item = deck[index];
        MyCardsArray.push(item);
        deck = deck.filter(c => c.name !== item.name);
    }
    let div_EnemyCardsArray = document.getElementsByClassName('EnemyCardsArray');
    let div_MyCardsArray = document.getElementsByClassName('MyCardsArray');

    if(div_EnemyCardsArray[0])
    {
        let ShowCardsDeck = document.createElement('div');
        ShowCardsDeck.className = 'CardsDeck';
        let backCard = CreateCard('рубашка');
        backCard.style = 'margin-right: -1.5vw;';
        ShowCardsDeck.appendChild(backCard);
        EnemyCardsArrayCount_span = document.createElement('span');
        EnemyCardsArrayCount_span.className = 'EnemyCardsArrayCount';
        ShowCardsDeck.appendChild(EnemyCardsArrayCount_span);
        div_EnemyCardsArray[0].appendChild(ShowCardsDeck);
    }
    if(div_MyCardsArray[0])
    {
        let ShowCardsDeck = document.createElement('div');
        ShowCardsDeck.className = 'CardsDeck';
        ShowCardsDeck.onclick  = MyCardsDeckClick;
        let backCard = CreateCard('рубашка');
        backCard.style = 'margin-right: -1.5vw;';
        ShowCardsDeck.appendChild(backCard);
        MyCardsArrayCount_span = document.createElement('span');
        MyCardsArrayCount_span.className = 'MyCardsArrayCount';
        ShowCardsDeck.appendChild(MyCardsArrayCount_span);
        div_MyCardsArray[0].appendChild(ShowCardsDeck);
    }
    GetEnemyDefenders();
    GetMyDefenders();
}

function MyCardsDeckClick() { // нажата колода
    if(MyCardsArray.length > 0 && !AttackCard && IsMyAttack)
    {
        AttackCard = MyCardsArray[0];
        let curr_name = AttackCard.name;
        let find_GoalKeeper = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Attack')[0].getElementsByClassName('Card')[0];
        find_GoalKeeper.appendChild(CreateCard(curr_name));
        MyCardsArray = MyCardsArray.filter(c => c.name !== curr_name);
        MyCardsArrayCount_span.textContent = `${MyCardsArray.length}`;
        CheckCardsDeck('My');
    }
}

function returnDateString(push_date){
    let date = new Date();
    return `${date.getDay() > 9?date.getDay():'0'+date.getDay()}.${date.getMonth() > 9?date.getMonth():'0'+date.getMonth()} - 
    ${date.getHours() > 9?date.getHours():'0'+date.getHours()} :
    ${date.getMinutes() > 9?date.getMinutes():'0'+date.getMinutes()} :
    ${date.getSeconds() > 9?date.getSeconds():'0'+date.getSeconds()}`;
}

function CardClick(value) { // Нажата карта
    console.log(value);
    let checkCard = value.split('_');
    if(checkCard.length > 1)
    {
        let type = checkCard[0];
        let pressed_card = checkCard[1];
        if(type === 'MyCards')
        {
            PressedMyCard(pressed_card);
        }
        else if(type === 'EnemyCards')
        {
            PressedEnemyCard(pressed_card);
        }

    }
}

function PressedMyCard(pressed_card) {
    if(IsMyAttack)
    {
        switch (pressed_card) {
            case 'Attack':
                //Нажата атакующая карта
                MyAttack();
                break;
            case 'GoalKeeper':
                //Нажата карта голкипера
                MyGoalKeeper();
                break;
            case 'LeftDefender':
                //Нажата карта левого защитника
                MyLeftDefender();
                break;
            case 'MidleDefender':
                //Нажата карта центрального защитника
                MyMidleDefender();
                break;
            case 'RightDefender':
                //Нажата карта правого защитника
                MyRightDefender();
                break;                    
            default:
                break;
        }
    }
}

function MyAttack(){
    if(!curren_pressedcard && AttackCard)
    {
        curren_pressedcard = AttackCard;
        let find_AttackCard = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Attack')[0].getElementsByClassName('Card')[0];
        find_AttackCard.style = press_style;
    }
    else
    {
        let find_AttackCard = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Attack')[0].getElementsByClassName('Card')[0];
        if(curren_pressedcard === AttackCard)
        {
            curren_pressedcard = undefined;
            find_AttackCard.style = '';
        }
    }
}

function MyGoalKeeper(){
    if(!curren_pressedcard)
    {
        curren_pressedcard = My_GoalKeeper;
        let find_GoalKeeper_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('GoalKeeper')[0].getElementsByClassName('Card')[0];
        find_GoalKeeper_div.style = press_style;
    }
    else
    {
        let find_GoalKeeper_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('GoalKeeper')[0].getElementsByClassName('Card')[0];
        if(curren_pressedcard !== My_GoalKeeper)
        {
            let findDef = MyDef.find(c => c.name === curren_pressedcard.name)
            if(findDef)//нажат защитник
            {
                if(curren_pressedcard === My_LeftDefender)
                {
                    let find_LeftDefender_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[0];
                    let oldChild = find_LeftDefender_div.firstElementChild;
                    let old_card = find_GoalKeeper_div.firstElementChild;
                    
                    find_LeftDefender_div.appendChild(old_card);
                    find_GoalKeeper_div.appendChild(oldChild);

                    let rememberCard = My_GoalKeeper;
                    My_GoalKeeper = My_LeftDefender;
                    My_LeftDefender = rememberCard;
                    find_LeftDefender_div.style = '';
                }
                else if(curren_pressedcard === My_MidleDefender)
                {
                    let find_MidleDefender_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[1];
                    let oldChild = find_MidleDefender_div.firstElementChild;
                    let old_card = find_GoalKeeper_div.firstElementChild;
                    
                    find_MidleDefender_div.appendChild(old_card);
                    find_GoalKeeper_div.appendChild(oldChild);

                    let rememberCard = My_GoalKeeper;
                    My_GoalKeeper = My_MidleDefender;
                    My_MidleDefender = rememberCard;
                    find_MidleDefender_div.style = '';
                }
                else
                {
                    let find_RightDefender_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[2];
                    let oldChild = find_RightDefender_div.firstElementChild;
                    let old_card = find_GoalKeeper_div.firstElementChild;
                    
                    find_RightDefender_div.appendChild(old_card);
                    find_GoalKeeper_div.appendChild(oldChild);

                    let rememberCard = My_GoalKeeper;
                    My_GoalKeeper = My_RightDefender;
                    My_RightDefender = rememberCard;
                    find_RightDefender_div.style = '';
                }
                curren_pressedcard = undefined;
                find_GoalKeeper_div.style = '';
            }
        }
        else
        {
            curren_pressedcard = undefined;
            find_GoalKeeper_div.style = '';
        }
    }
}

function MyLeftDefender(){
    if(!curren_pressedcard)
    {
        curren_pressedcard = My_LeftDefender;
        let find_LeftDefender_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[0];
        find_LeftDefender_div.style = press_style;
    }
    else
    {
        let find_LeftDefender_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[0];
        if(curren_pressedcard !== My_LeftDefender)
        {
            let findDef = MyDef.find(c => c.name === curren_pressedcard.name);
            if(findDef)//нажат защитник
            {
                if(curren_pressedcard === My_GoalKeeper)
                {
                    let find_GoalKeeper_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('GoalKeeper')[0].getElementsByClassName('Card')[0];
                    let oldChild = find_LeftDefender_div.firstElementChild;
                    let old_card = find_GoalKeeper_div.firstElementChild;
                    
                    find_LeftDefender_div.appendChild(old_card);
                    find_GoalKeeper_div.appendChild(oldChild);

                    let rememberCard = My_GoalKeeper;
                    My_GoalKeeper = My_LeftDefender;
                    My_LeftDefender = rememberCard;
                    find_GoalKeeper_div.style = '';
                }
                else if(curren_pressedcard === My_MidleDefender)
                {
                    let find_MidleDefender_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[1];
                    let oldChild = find_MidleDefender_div.firstElementChild;
                    let old_card = find_LeftDefender_div.firstElementChild;
                    
                    find_MidleDefender_div.appendChild(old_card);
                    find_LeftDefender_div.appendChild(oldChild);

                    let rememberCard = My_LeftDefender;
                    My_LeftDefender = My_MidleDefender;
                    My_MidleDefender = rememberCard;
                    find_MidleDefender_div.style = '';
                }
                else
                {
                    let find_RightDefender_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[2];
                    let oldChild = find_RightDefender_div.firstElementChild;
                    let old_card = find_LeftDefender_div.firstElementChild;
                    
                    find_RightDefender_div.appendChild(old_card);
                    find_LeftDefender_div.appendChild(oldChild);

                    let rememberCard = My_LeftDefender;
                    My_LeftDefender = My_RightDefender;
                    My_RightDefender = rememberCard;
                    find_RightDefender_div.style = '';
                }
                curren_pressedcard = undefined;
                find_LeftDefender_div.style = '';
            }
        }
        else
        {
            curren_pressedcard = undefined;
            find_LeftDefender_div.style = '';
        }
    }
}

function MyMidleDefender(){
    if(!curren_pressedcard)
    {
        curren_pressedcard = My_MidleDefender;
        let find_MidleDefender_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[1];
        find_MidleDefender_div.style = press_style;
    }
    else
    {
        let find_MidleDefender_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[1];
        if(curren_pressedcard !== My_MidleDefender)
        {
            let findDef = MyDef.find(c => c.name === curren_pressedcard.name);
            if(findDef)//нажат защитник
            {
                if(curren_pressedcard === My_GoalKeeper)
                {
                    let find_GoalKeeper_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('GoalKeeper')[0].getElementsByClassName('Card')[0];
                    let oldChild = find_MidleDefender_div.firstElementChild;
                    let old_card = find_GoalKeeper_div.firstElementChild;
                    
                    find_MidleDefender_div.appendChild(old_card);
                    find_GoalKeeper_div.appendChild(oldChild);

                    let rememberCard = My_GoalKeeper;
                    My_GoalKeeper = My_MidleDefender;
                    My_MidleDefender = rememberCard;
                    find_GoalKeeper_div.style = '';
                }
                else if(curren_pressedcard === My_LeftDefender)
                {
                    let find_LeftDefender_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[0];
                    let oldChild = find_MidleDefender_div.firstElementChild;
                    let old_card = find_LeftDefender_div.firstElementChild;
                    
                    find_MidleDefender_div.appendChild(old_card);
                    find_LeftDefender_div.appendChild(oldChild);

                    let rememberCard = My_LeftDefender;
                    My_LeftDefender = My_MidleDefender;
                    My_MidleDefender = rememberCard;
                    find_LeftDefender_div.style = '';
                }
                else
                {
                    let find_RightDefender_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[2];
                    let oldChild = find_RightDefender_div.firstElementChild;
                    let old_card = find_MidleDefender_div.firstElementChild;
                    
                    find_RightDefender_div.appendChild(old_card);
                    find_MidleDefender_div.appendChild(oldChild);

                    let rememberCard = My_MidleDefender;
                    My_MidleDefender = My_RightDefender;
                    My_RightDefender = rememberCard;
                    find_RightDefender_div.style = '';
                }
                curren_pressedcard = undefined;
                find_MidleDefender_div.style = '';
            }
        }
        else
        {
            curren_pressedcard = undefined;
            find_MidleDefender_div.style = '';
        }
    }
}

function MyRightDefender(){
    if(!curren_pressedcard)
    {
        curren_pressedcard = My_RightDefender;
        let find_RightDefender_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[2];
        find_RightDefender_div.style = press_style;
    }
    else
    {
        let find_RightDefender_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[2];
        if(curren_pressedcard !== My_RightDefender)
        {
            let findDef = MyDef.find(c => c.name === curren_pressedcard.name);
            if(findDef)//нажат защитник
            {
                if(curren_pressedcard === My_GoalKeeper)
                {
                    let find_GoalKeeper_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('GoalKeeper')[0].getElementsByClassName('Card')[0];
                    let oldChild = find_RightDefender_div.firstElementChild;
                    let old_card = find_GoalKeeper_div.firstElementChild;
                    
                    find_RightDefender_div.appendChild(old_card);
                    find_GoalKeeper_div.appendChild(oldChild);

                    let rememberCard = My_GoalKeeper;
                    My_GoalKeeper = My_RightDefender;
                    My_RightDefender = rememberCard;
                    find_GoalKeeper_div.style = '';
                }
                else if(curren_pressedcard === My_LeftDefender)
                {
                    let find_LeftDefender_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[0];
                    let oldChild = find_RightDefender_div.firstElementChild;
                    let old_card = find_LeftDefender_div.firstElementChild;
                    
                    find_RightDefender_div.appendChild(old_card);
                    find_LeftDefender_div.appendChild(oldChild);

                    let rememberCard = My_LeftDefender;
                    My_LeftDefender = My_RightDefender;
                    My_RightDefender = rememberCard;
                    find_LeftDefender_div.style = '';
                }
                else
                {
                    let find_MidleDefender_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[1];
                    let oldChild = find_RightDefender_div.firstElementChild;
                    let old_card = find_MidleDefender_div.firstElementChild;
                    
                    find_RightDefender_div.appendChild(old_card);
                    find_MidleDefender_div.appendChild(oldChild);

                    let rememberCard = My_MidleDefender;
                    My_MidleDefender = My_RightDefender;
                    My_RightDefender = rememberCard;
                    find_MidleDefender_div.style  = '';
                }
                curren_pressedcard = undefined;
                find_RightDefender_div.style = '';
            }
        }
        else
        {
            curren_pressedcard = undefined;
            find_RightDefender_div.style = '';
        }
    }
}

function PressedEnemyCard(pressed_card) {
    switch (pressed_card) {
        case 'GoalKeeper':
            //Нажата карта голкипера
            EnemyGoalKeeper();
            break;
        case 'LeftDefender':
            //Нажата карта левого защитника
            EnemyLeftDefender();
            break;
        case 'MidleDefender':
            //Нажата карта центрального защитника
            EnemyMidleDefender();
            break;
        case 'RightDefender':
            //Нажата карта правого защитника
            EnemyRightDefender();
            break;                    
        default:
            break;
      }
}

function EnemyRightDefender()
{
    if(curren_pressedcard && AttackCard && curren_pressedcard === AttackCard && Enemy_RightDefender)
    {
        let find_AttackCard = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Attack')[0].getElementsByClassName('Card')[0];
        let enemyCardForAttack = Enemy_RightDefender;
        let enemyCardForAttack_div = document.getElementsByClassName('EnemyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[2];
        Enemy_RightDefender = undefined;
        AttackAnalysis(AttackCard,enemyCardForAttack,find_AttackCard,enemyCardForAttack_div);
    }
}

function EnemyMidleDefender()
{
    if(curren_pressedcard && AttackCard && curren_pressedcard === AttackCard && Enemy_MidleDefender)
    {
        let find_AttackCard = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Attack')[0].getElementsByClassName('Card')[0];
        let enemyCardForAttack = Enemy_MidleDefender;
        let enemyCardForAttack_div = document.getElementsByClassName('EnemyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[1];
        Enemy_MidleDefender = undefined;
        AttackAnalysis(AttackCard,enemyCardForAttack,find_AttackCard,enemyCardForAttack_div);
    }
}

function EnemyLeftDefender()
{
    if(curren_pressedcard && AttackCard && curren_pressedcard === AttackCard && Enemy_LeftDefender)
    {
        let find_AttackCard = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Attack')[0].getElementsByClassName('Card')[0];
        let enemyCardForAttack = Enemy_LeftDefender;
        let enemyCardForAttack_div = document.getElementsByClassName('EnemyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[0];
        Enemy_LeftDefender = undefined;
        AttackAnalysis(AttackCard,enemyCardForAttack,find_AttackCard,enemyCardForAttack_div);
    }
}

function EnemyGoalKeeper()
{
    if(curren_pressedcard && AttackCard && curren_pressedcard === AttackCard && enemyDef && !Enemy_LeftDefender && !Enemy_MidleDefender && !Enemy_RightDefender && Enemy_GoalKeeper)
    {
        let find_AttackCard = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Attack')[0].getElementsByClassName('Card')[0];
        let enemyCardForAttack = Enemy_GoalKeeper;
        let enemyCardForAttack_div = document.getElementsByClassName('EnemyCards')[0].getElementsByClassName('GoalKeeper')[0].getElementsByClassName('Card')[0];
        Enemy_GoalKeeper = undefined;
        AttackAnalysis(AttackCard,enemyCardForAttack,find_AttackCard,enemyCardForAttack_div);
    }
}


function GetEnemyDefenders(){ // Поставить защиту врага
    let max = 4 - enemyDef.length;
    if(EnemyCardsArray && EnemyCardsArray.length > 0 && max > 0)
    {
        let names_string = '';
        for(let i = 0; i < max; i++)
        {
            if(EnemyCardsArray.length > i)
            {
                enemyDef.push(EnemyCardsArray[i]);
                names_string += EnemyCardsArray[i].name + ',';
            }
        }
        EnemyCardsArray = EnemyCardsArray.filter(c => !names_string.includes(c.name));
    }
    if(enemyDef.length > 0)
    {
        let maxIndex = enemyDef.reduce((acc, curr, i) => enemyDef[acc].weight > curr.weight ? acc : i, 0);
        let find_GoalKeeper = document.getElementsByClassName('EnemyCards')[0].getElementsByClassName('GoalKeeper')[0].getElementsByClassName('Card')[0];
        find_GoalKeeper.appendChild(CreateCard(enemyDef[maxIndex].name));
        Enemy_GoalKeeper = enemyDef[maxIndex];
        let count = 0;
        for(let i = 0; i < enemyDef.length; i++)
        {
            if(i !== maxIndex)
            {
                let find_Defenders = document.getElementsByClassName('EnemyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[count];
                find_Defenders.appendChild(CreateCard(enemyDef[i].name));
                if(count === 0)
                {
                    Enemy_LeftDefender = enemyDef[i];
                }
                else if(count === 1)
                {
                    Enemy_MidleDefender = enemyDef[i];
                }
                else
                {
                    Enemy_RightDefender = enemyDef[i];
                }
                count++;
            }
        }
    }
    else
    {
        alert(GAME_OVER);
    }
    EnemyCardsArrayCount_span.textContent = `${EnemyCardsArray.length}`;
    CheckCardsDeck('Enemy');
}

function GetMyDefenders(){ // Поставить мою защиту
    let max = 4 - MyDef.length;
    if(MyCardsArray && MyCardsArray.length > 0 && max > 0)
    {
        let names_string = '';
        for(let i = 0; i < max; i++)
        {
            if(MyCardsArray.length > i)
            {
                MyDef.push(MyCardsArray[i]);
                names_string += MyCardsArray[i].name + ',';
            }
        }
        MyCardsArray = MyCardsArray.filter(c => !names_string.includes(c.name));
    }
    if(MyDef.length > 0)
    {
        let maxIndex = MyDef.reduce((acc, curr, i) => MyDef[acc].weight > curr.weight ? acc : i, 0);
        let find_GoalKeeper = document.getElementsByClassName('MyCards')[0].getElementsByClassName('GoalKeeper')[0].getElementsByClassName('Card')[0];
        find_GoalKeeper.appendChild(CreateCard(MyDef[maxIndex].name));
        My_GoalKeeper = MyDef[maxIndex];
        let count = 0;
        for(let i = 0; i < MyDef.length; i++)
        {
            if(i !== maxIndex)
            {
                let find_Defenders = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[count];
                find_Defenders.appendChild(CreateCard(MyDef[i].name));
                if(count === 0)
                {
                    My_LeftDefender = MyDef[i];
                }
                else if(count === 1)
                {
                    My_MidleDefender = MyDef[i];
                }
                else
                {
                    My_RightDefender = MyDef[i];
                }
                count++;
            }
        }
    }
    else
    {
        alert(GAME_OVER);
    }
    MyCardsArrayCount_span.textContent = `${MyCardsArray.length}`;
    CheckCardsDeck('My');
}

function AttackAnalysis(Push_AttackCard,Push_enemyCardForAttack,Push_find_AttackCard,Push_enemyCardForAttack_div)
{
    debugger;
    if(Push_find_AttackCard.firstElementChild)
    {
        let AttackCardChild = Push_find_AttackCard.firstElementChild;
        AttackCardChild.style = 'margin-left: -80%;';
        Push_enemyCardForAttack_div.appendChild(AttackCardChild);
    }
    AttackCard = undefined;
    Enemy_AttackCard = undefined;
    let AW = Push_AttackCard.weight;
    let DW = Push_enemyCardForAttack.weight;
    let Difference = AW - DW;
    if(IsMyAttack)
    {
        enemyDef = enemyDef.filter(c => c.name !== Push_enemyCardForAttack.name);
    }
    else
    {
        MyDef = MyDef.filter(c => c.name !== Push_enemyCardForAttack.name);
    }
    if((Difference > 0 && Difference < 8) || Difference === -8)
    {
        Extraction.push(Push_AttackCard,Push_enemyCardForAttack);
        Extraction = Extraction.concat(EqualCaseHelpers);
        EqualCaseHelpers = [];
        if(IsMyAttack)
        {
            My_Win();
        }
        else
        {
            Enemy_Win();
            OpponentAttack(1);
        }
    }
    else if(Difference === 0)
    {
        if(EnemyCardsArray.length > 1 && MyCardsArray.length > 1)
        {
            //Если в колодах более 1 карты
            let EnemyHelp = EnemyCardsArray.shift();
            let MyHelp = MyCardsArray.shift();
            EqualCaseHelpers.push(MyHelp,EnemyHelp,Push_AttackCard,Push_enemyCardForAttack);
            let EnemyHelp_backCard = CreateCard('рубашка');
            let MyHelp_backCard = CreateCard('рубашка');
            EnemyHelp_backCard.style = 'margin-left: -100%;';
            Push_enemyCardForAttack_div.appendChild(EnemyHelp_backCard);
            MyHelp_backCard.style = 'margin-left: -80%;';
            Push_enemyCardForAttack_div.appendChild(MyHelp_backCard);

            let newEnemyCard = EnemyCardsArray.shift();
            let newMyCard = MyCardsArray.shift();
            
            let newEnemyCard_backCard = CreateCard(newEnemyCard.name);
            let newMyCard_backCard = CreateCard(newMyCard.name);
            newEnemyCard_backCard.style = 'margin-left: -70%;';
            Push_enemyCardForAttack_div.appendChild(newEnemyCard_backCard);
            newMyCard_backCard.style = 'margin-left: -50%;';
            Push_enemyCardForAttack_div.appendChild(newMyCard_backCard);
            MyCardsArrayCount_span.textContent = `${MyCardsArray.length}`;
            EnemyCardsArrayCount_span.textContent = `${EnemyCardsArray.length}`;
            if(IsMyAttack)
            {
                AttackCard = newMyCard;
                window.setTimeout(AttackAnalysis,1000,newMyCard,newEnemyCard,Push_find_AttackCard,Push_enemyCardForAttack_div);
            }
            else
            {
                window.setTimeout(AttackAnalysis,1000,newEnemyCard,newMyCard,Push_find_AttackCard,Push_enemyCardForAttack_div);
            }
        }
        else if(MyCardsArray.length > 1)
        {
            //Если у меня в колоде больше карт
            if(IsMyAttack)
            {
                Extraction.push(Push_AttackCard,Push_enemyCardForAttack);
                Extraction = Extraction.concat(EqualCaseHelpers);
                EqualCaseHelpers = [];
                My_Win();
            }
            else
            {
                Enemy_Lost(Push_AttackCard,Push_enemyCardForAttack);
            }
        }
        else if(EnemyCardsArray.length > 1)
        {
            //Если у противника карт больше
            if(IsMyAttack)
            {
                My_Lost(Push_AttackCard,Push_enemyCardForAttack);
                OpponentAttack(1);
            }
            else
            {
                Extraction.push(Push_AttackCard,Push_enemyCardForAttack);
                Extraction = Extraction.concat(EqualCaseHelpers);
                EqualCaseHelpers = [];
                Enemy_Win();
                OpponentAttack(1);
            }
        }
        else
        {
            //Нет карт ни у кого
            if(IsMyAttack)
            {
                My_Lost(Push_AttackCard,Push_enemyCardForAttack)
                OpponentAttack(1);
            }
            else
            {
                Enemy_Lost(Push_AttackCard,Push_enemyCardForAttack)
            }
        }
    }
    else
    {
        if(IsMyAttack)
        {
            My_Lost(Push_AttackCard,Push_enemyCardForAttack);
            OpponentAttack(1);
        }
        else
        {
            Enemy_Lost(Push_AttackCard,Push_enemyCardForAttack)
        }
    }
    curren_pressedcard = undefined;
    Push_find_AttackCard.style = '';
}

function Enemy_Win(){
    if(MyDef.length < 1)
    {
        Score[1]++;
        let find_score_span = document.getElementsByClassName('score')[0];
        find_score_span.textContent = `MyGoals ${Score[0]} : ${Score[1]} EnemyGoals`;
        EnemyCardsArray = EnemyCardsArray.concat(Extraction);
        EnemyCardsArrayCount_span.textContent = `${EnemyCardsArray.length}`;
        CheckCardsDeck('Enemy');
        Extraction = [];
        ClearEnemyDefenders('MyCards');
        GetMyDefenders();
    }
    else if(EnemyCardsArray.length < 1)
    {
        EnemyCardsArray = EnemyCardsArray.concat(Extraction);
        EnemyCardsArrayCount_span.textContent = `${EnemyCardsArray.length}`;
        CheckCardsDeck('Enemy');
        Extraction = [];
        ClearEnemyDefenders('EnemyCards');
        GetEnemyDefenders();
    }
}

function Enemy_Lost(Push_AttackCard,Push_enemyCardForAttack){
    MyCardsArray.push(Push_AttackCard,Push_enemyCardForAttack);
    MyCardsArray = MyCardsArray.concat(EqualCaseHelpers);
    MyCardsArrayCount_span.textContent = `${MyCardsArray.length}`;
    EnemyCardsArray = EnemyCardsArray.concat(Extraction);
    EnemyCardsArrayCount_span.textContent = `${EnemyCardsArray.length}`;
    CheckCardsDeck('Enemy');
    CheckCardsDeck('My');
    EqualCaseHelpers = [];
    Extraction = [];
    ClearEnemyDefenders('MyCards');
    GetMyDefenders();
    IsMyAttack = true;
}

function My_Win(){
    if(enemyDef.length < 1)
    {
        Score[0]++;
        let find_score_span = document.getElementsByClassName('score')[0];
        find_score_span.textContent = `MyGoals ${Score[0]} : ${Score[1]} EnemyGoals`;
        MyCardsArray = MyCardsArray.concat(Extraction);
        MyCardsArrayCount_span.textContent = `${MyCardsArray.length}`;
        CheckCardsDeck('My');
        Extraction = [];
        ClearEnemyDefenders('EnemyCards');
        GetEnemyDefenders();
    }
    else if(MyCardsArray.length < 1)
    {
        MyCardsArray = MyCardsArray.concat(Extraction);
        MyCardsArrayCount_span.textContent = `${MyCardsArray.length}`;
        CheckCardsDeck('My');
        Extraction = [];
        ClearEnemyDefenders('EnemyCards');
        GetEnemyDefenders();
    }
}

function My_Lost(Push_AttackCard,Push_enemyCardForAttack){
    IsMyAttack = false;
    EnemyCardsArray.push(Push_AttackCard,Push_enemyCardForAttack);
    EnemyCardsArray = EnemyCardsArray.concat(EqualCaseHelpers);
    EnemyCardsArrayCount_span.textContent = `${EnemyCardsArray.length}`;
    MyCardsArray = MyCardsArray.concat(Extraction);
    MyCardsArrayCount_span.textContent = `${MyCardsArray.length}`;
    CheckCardsDeck('Enemy');
    CheckCardsDeck('My');
    EqualCaseHelpers = [];
    Extraction = [];
    ClearEnemyDefenders('EnemyCards');
    GetEnemyDefenders();
}

function ClearEnemyDefenders(select) 
{
    let enemyCardForAttack_div = document.getElementsByClassName(select)[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[2];
    while (enemyCardForAttack_div.firstChild) {
        enemyCardForAttack_div.removeChild(enemyCardForAttack_div.firstChild);
    }
    enemyCardForAttack_div = document.getElementsByClassName(select)[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[1];
    while (enemyCardForAttack_div.firstChild) {
        enemyCardForAttack_div.removeChild(enemyCardForAttack_div.firstChild);
    }
    enemyCardForAttack_div = document.getElementsByClassName(select)[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[0];
    while (enemyCardForAttack_div.firstChild) {
        enemyCardForAttack_div.removeChild(enemyCardForAttack_div.firstChild);
    }
    enemyCardForAttack_div = document.getElementsByClassName(select)[0].getElementsByClassName('GoalKeeper')[0].getElementsByClassName('Card')[0];
    while (enemyCardForAttack_div.firstChild) {
        enemyCardForAttack_div.removeChild(enemyCardForAttack_div.firstChild);
    }
}

function OpponentAttack(count){
    switch (count) {
        case 1:
            window.setTimeout(OpponentAttack,1000,2);
            break;
        case 2:
            EnemyCardsDeckClick();
            window.setTimeout(OpponentAttack,1000,3);
            break;
        case 3:
            window.setTimeout(StartEnemyAttack,1000);
            break;                 
        default:
            break;
      }
}

function EnemyCardsDeckClick() { // нажата колода врага
    if(EnemyCardsArray.length > 0 && !Enemy_AttackCard && !IsMyAttack)
    {
        Enemy_AttackCard = EnemyCardsArray[0];
        let curr_name = Enemy_AttackCard.name;
        let find_GoalKeeper = document.getElementsByClassName('EnemyCards')[0].getElementsByClassName('Attack')[0].getElementsByClassName('Card')[0];
        find_GoalKeeper.appendChild(CreateCard(curr_name));
        EnemyCardsArray = EnemyCardsArray.filter(c => c.name !== curr_name);
        EnemyCardsArrayCount_span.textContent = `${EnemyCardsArray.length}`;
        CheckCardsDeck('Enemy');
    }
}

function StartEnemyAttack(){
    if(Enemy_AttackCard)
    {
        let find_AttackCard = document.getElementsByClassName('EnemyCards')[0].getElementsByClassName('Attack')[0].getElementsByClassName('Card')[0];
        if(!My_LeftDefender && !My_MidleDefender && !My_RightDefender)
        {
            //Атака на вратаря
            let enemyCardForAttack = My_GoalKeeper;
            let enemyCardForAttack_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('GoalKeeper')[0].getElementsByClassName('Card')[0];
            My_GoalKeeper = undefined;
            AttackAnalysis(Enemy_AttackCard,enemyCardForAttack,find_AttackCard,enemyCardForAttack_div);
        }
        else
        {
            let Max_enemyCardForAttack;
            let Max_enemyCardForAttack_div;

            let enemyCardForAttack;
            let enemyCardForAttack_div;
            if(My_LeftDefender) 
            {
                if((!Max_enemyCardForAttack || My_LeftDefender.weight > Max_enemyCardForAttack.weight) && !enemyCardForAttack)
                {
                    Max_enemyCardForAttack = My_LeftDefender;
                    Max_enemyCardForAttack_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[0];
                }
                if(Enemy_AttackCard.weight > My_LeftDefender.weight && (!enemyCardForAttack || enemyCardForAttack.weight < My_LeftDefender.weight))
                {
                    enemyCardForAttack = My_LeftDefender;
                    enemyCardForAttack_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[0];
                }
            }
            if(My_MidleDefender)
            {
                if((!Max_enemyCardForAttack || My_MidleDefender.weight > Max_enemyCardForAttack.weight) && !enemyCardForAttack)
                {
                    Max_enemyCardForAttack = My_MidleDefender;
                    Max_enemyCardForAttack_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[1];
                }
                if(Enemy_AttackCard.weight > My_MidleDefender.weight && (!enemyCardForAttack || enemyCardForAttack.weight < My_MidleDefender.weight))
                {
                    enemyCardForAttack = My_MidleDefender;
                    enemyCardForAttack_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[1];
                }
            }
            if(My_RightDefender)
            {
                if((!Max_enemyCardForAttack || My_RightDefender.weight > Max_enemyCardForAttack.weight) && !enemyCardForAttack)
                {
                    Max_enemyCardForAttack = My_RightDefender;
                    Max_enemyCardForAttack_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[2];
                }
                if(Enemy_AttackCard.weight > My_RightDefender.weight && (!enemyCardForAttack || enemyCardForAttack.weight < My_RightDefender.weight))
                {
                    enemyCardForAttack = My_RightDefender;
                    enemyCardForAttack_div = document.getElementsByClassName('MyCards')[0].getElementsByClassName('Defenders')[0].getElementsByClassName('Card')[2];
                }
            }
            if(!enemyCardForAttack)
            {
                enemyCardForAttack = Max_enemyCardForAttack;
                enemyCardForAttack_div = Max_enemyCardForAttack_div
            }
            if(enemyCardForAttack && My_LeftDefender && enemyCardForAttack.name === My_LeftDefender.name)
            {
                My_LeftDefender = undefined;
            }
            if(enemyCardForAttack && My_MidleDefender && enemyCardForAttack.name === My_MidleDefender.name)
            {
                My_MidleDefender = undefined;
            }
            if(enemyCardForAttack && My_RightDefender && enemyCardForAttack.name === My_RightDefender.name)
            {
                My_RightDefender = undefined;
            }
            AttackAnalysis(Enemy_AttackCard,enemyCardForAttack,find_AttackCard,enemyCardForAttack_div);
        }
    }
}

function CreateCard(name) {
    let img = document.createElement('img');
    img.src = `images/ИГРАЛЬНЫЕ КАРТЫ 54 ШТ/${name}.jpg`;
    img.style.width = image_width;
    img.style.height = image_height;
    img.className = 'image_style';
    return img;
}

function CheckCardsDeck(name) {
    if(name == 'My')
    {
        let find_img_MyCardsDeck = document.getElementsByClassName('MyCards')[0].getElementsByClassName('CardsDeck')[0].getElementsByClassName('image_style')[0];
        if(MyCardsArray.length < 1)
        {
            find_img_MyCardsDeck.src = ``;
        }
        else
        {
            find_img_MyCardsDeck.src = `images/ИГРАЛЬНЫЕ КАРТЫ 54 ШТ/рубашка.jpg`;
        }
    }
    else
    {
        let find_img_MyCardsDeck = document.getElementsByClassName('EnemyCards')[0].getElementsByClassName('CardsDeck')[0].getElementsByClassName('image_style')[0];
        if(EnemyCardsArray.length < 1)
        {
            find_img_MyCardsDeck.src = ``;
        }
        else
        {
            find_img_MyCardsDeck.src = `images/ИГРАЛЬНЫЕ КАРТЫ 54 ШТ/рубашка.jpg`;
        }
    }
}