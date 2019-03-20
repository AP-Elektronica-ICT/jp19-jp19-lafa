#!/bin/bash

#usage price.sh file
cat $1 | 
sed -r 's/,/./g'| 
sed -r 's/\s+/ /g'| 
awk -F\| '{
    print $3, $4
    }' | 
awk -F€ '
    BEGIN{i=0;}
    {
    if ($2 ~ /[0-9]*.[0-9]*/){
        print $2$1"= €"$2*$1; 
        a[i++]=$2*$1;
        }
    }
        
    END{
        for (key in a){
            b += a[key];
            };
        print "Total price: €",b;
        }'