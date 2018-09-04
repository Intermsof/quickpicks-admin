export abstract class DataInputter{

    abstract reset();
};

export class NewContestComponentDataInputter extends DataInputter{
    public homeTeamName: string = '';
    public awayTeamName: string = '';
    public spread: number = null;
    public gameStartDate: string = '';
    public gameStartTime: string = '';
    public contestDate: string = '';
    
    reset(){
        this.homeTeamName = '';
        this.awayTeamName = '';
        this.spread = null;
        this.gameStartDate = '';
        this.gameStartTime = '';
        this.contestDate = '';
    }
};

