package org.example.cardgame.values;

import co.com.sofka.domain.generic.Identity;

public class TableroId extends Identity {

    public TableroId(String value) {
        super(value);
    }

    public TableroId(){

    }

    public static TableroId of(String value){
        return  new TableroId(value);
    }
}
