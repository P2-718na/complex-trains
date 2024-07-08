for i in {0..99999}
do
	take data
	take trains
	wget -q "http://www.viaggiatreno.it/vt_pax_internet/mobile/scheda?dettaglio=visualizza&numeroTreno=${i}&tipoRicerca=numero&lang=IT" -O "${i}.html" || echo $i >> ../errors.txt
	echo ${i}
done