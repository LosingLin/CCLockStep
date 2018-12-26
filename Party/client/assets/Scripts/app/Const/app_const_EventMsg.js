
let EventMsg = {
    SocketConnected: 'SocketConnected',

    //Room
    UpdateRoomPlayer: 'UpdateRoomPlayer',    //玩家信息更新
    ExitRoom: 'ExitRoom',   //退出房间


    //Mahjong
    MahjongOutCard_B: 'MahjongOutCard_B',       //出牌
    MahjongOutCard_L: 'MahjongOutCard_L',       //出牌
    MahjongOutCard_R: 'MahjongOutCard_R',       //出牌
    MahjongOutCard_T: 'MahjongOutCard_T',       //出牌
    MahjongCPGCard_B: 'MahjongCPGCard_B',       //吃碰杠
    MahjongCPGCard_L: 'MahjongCPGCard_L',       //吃碰杠
    MahjongCPGCard_R: 'MahjongCPGCard_R',       //吃碰杠
    MahjongCPGCard_T: 'MahjongCPGCard_T',       //吃碰杠
};

module.exports = EventMsg;