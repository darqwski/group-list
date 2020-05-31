<?php

class Stream
{
    var $array;
    public function __construct($data = Array())
    {
        $this->array = $data;
    }
    public function map($func){
        $this->array = array_map($func,$this->array);
        return $this;
    }
    public function filter($func){
        $this->array = array_filter($this->array,$func);
        return $this;
    }
    public function get(){
        return $this->array;
    }
    public function groupBy($index){
        $groupedArray = [];
        foreach ($this->array as $item){
            if(!isset($item[$index]))
                throw new Error("No index: $index");

            if(!isset($groupedArray[$item[$index]])){
                $groupedArray[$item[$index]] = [];
            }

            array_push($groupedArray[$item[$index]], $item);
        }
        $this->array = $groupedArray;
        return $this;
    }

    public function toArray(){
        $this->array = array_values($this->array);
        return $this;
    }
    public function getFromQuery($query){
        $items = getCommand($query);
        if($items == false) {
            $this->array = [];
        } else {
            $this->array =$items;
        }
        return $this;
    }

    public function slice($start, $length = NULL){
        $this->array = array_slice($this->array, $start, $length);

        return $this;
    }

    public function join($table){
        $this->array = array_merge($this->array, $table);

        return $this;
    }
    public function toJson(){
        return json_encode($this->array);
    }
}
