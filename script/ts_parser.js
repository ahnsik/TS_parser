/*
    ts_parser.js
    - TS packet parser : TS 패킷을 분석해서 bit별로 parsing 도 하고...
    - PID 별로 section 을 골라서 만들어 주기도 하고.. (구상 중)
*/

var txt_syncbyte = document.getElementById("sync_byte");
var txt_ts_error_indi = document.getElementById("ts_error_indi");
var txt_pusi = document.getElementById("pusi");
var txt_ts_priority = document.getElementById("ts_priority");
var txt_pid = document.getElementById("pid");
var txt_ts_scrmb_ctrl = document.getElementById("ts_scrmb_ctrl");
var txt_adapt_field_ctrl = document.getElementById("adapt_field_ctrl");
var txt_cont_count = document.getElementById("cont_count");
var txt_adapt_field_len = document.getElementById("adapt_field_len");
var txt_discont_indi = document.getElementById("discont_indi");
var txt_rnd_accs_indi = document.getElementById("rnd_accs_indi");
var txt_es_prio_indi = document.getElementById("es_prio_indi");
var txt_pcr_flg = document.getElementById("pcr_flg");
var txt_opcr_flg = document.getElementById("opcr_flg");
var txt_splc_pont_flg = document.getElementById("splc_pont_flg");
var txt_ts_priv_flg = document.getElementById("ts_priv_flg");
var txt_adapt_extent_flg = document.getElementById("adapt_extent_flg");
var txt_option_field = document.getElementById("option_field");
var txt_stuff_adapt = document.getElementById("stuff_adapt");

var val_syncbyte = "";
var val_ts_error_indi = "";
var val_pusi = "";
var val_ts_priority = "";
var val_pid = "";
var val_ts_scrmb_ctrl = "";
var val_adapt_field_ctrl = "";
var val_cont_count = "";
var val_adapt_field_len = "";
var val_discont_indi = "";
var val_rnd_accs_indi = "";
var val_es_prio_indi = "";
var val_pcr_flg = "";
var val_opcr_flg = "";
var val_splc_pont_flg = "";
var val_ts_priv_flg = "";
var val_adapt_extent_flg = "";
var val_option_field = "";
var val_stuff_adapt = "";

var val_payload = "";


var ts_header_parse = (blob) => {

    val_syncbyte = blob[0];
    if (val_syncbyte != 0x47) {         // syncbyte 의 값은 항상 0x47 이어야만 함. 아니라면 TS패킷이 아닌 것.
        txt_syncbyte.style.background = "red";
    }
    val_ts_error_indi = (blob[1]>>7)&0x01;
    val_pusi = (blob[1]>>6)&0x01;
    val_ts_priority = (blob[1]>>5)&0x01;
    val_pid = ((blob[1]<<3)&0xE0) | blob[2];
    val_ts_scrmb_ctrl = (blob[3]>>6)&0x03;
    val_adapt_field_ctrl = (blob[3]>>4)&0x03;
    val_cont_count = blob[3]&0x0F;
    /*  switch(val_adapt_field_ctrl) {
            case '00': Reserved for future use by ISO/IEC
            case '01': No adaptation_field, payload only.
            case '10': Adaptation_field only. no payload.
            case '11': Adaptation_field followed by payload.
        }  */
    let offset = 4;
    if ( (val_adapt_field_ctrl==2) || (val_adapt_field_ctrl==3) ) {
        val_adapt_field_len = blob[4];
        val_discont_indi = (blob[5]>>7)&0x01;       // 성능개선여부 
        val_rnd_accs_indi = (blob[5]>>6)&0x01;
        val_es_prio_indi = (blob[5]>>5)&0x01;
        val_pcr_flg = (blob[5]>>4)&0x01;
        val_opcr_flg = (blob[5]>>3)&0x01;
        val_splc_pont_flg = (blob[5]>>2)&0x01;
        val_ts_priv_flg = (blob[5]>>1)&0x01;
        val_adapt_extent_flg = (blob[5])&0x01;
        // TODO: optional field.
        // val_option_field = blob[6];
        // val_stuff_adapt = blob[7];
        ts_optional_parse(blob.slice(offset) );
        set_option_parse_result();

        offset += (1+val_adapt_field_len);
    } else {
        txt_adapt_field_len.style.background = "darkgray";
        txt_discont_indi.style.background = "darkgray";
        txt_rnd_accs_indi.style.background = "darkgray";
        txt_es_prio_indi.style.background = "darkgray";
        txt_pcr_flg.style.background = "darkgray";
        txt_opcr_flg.style.background = "darkgray";
        txt_splc_pont_flg.style.background = "darkgray";
        txt_ts_priv_flg.style.background = "darkgray";
        txt_adapt_extent_flg.style.background = "darkgray";
        txt_option_field.style.background = "darkgray";
        txt_stuff_adapt.style.background = "darkgray";

        val_adapt_field_len = 0;
    }

    if ( (val_adapt_field_ctrl==1) || (val_adapt_field_ctrl==3) ) {     // payload 가 있을 때에만.
        console.log("offset="+offset);

    }
    val_payload = blob.slice(offset);

}


var txt_pcr_high = document.getElementById("pcr_high");
var txt_pcr_low = document.getElementById("pcr_low");
var txt_opcr_high = document.getElementById("opcr_high");
var txt_opcr_low = document.getElementById("opcr_low");
var txt_splice_cnt_down = document.getElementById("splice_cnt_down");
var txt_ts_priv_data_len = document.getElementById("ts_priv_data_length");
var txt_priv_data_bytes = document.getElementById("priv_data_bytes");
var txt_adapt_extent_len = document.getElementById("adapt_extent_length");
var txt_ltw_flg = document.getElementById("ltw_flg");
var txt_pcw_rate_flg = document.getElementById("pcw_rate_flg");
var txt_smls_splic_flg = document.getElementById("smls_splic_flg");
var txt_reserved = document.getElementById("reserved");
var txt_adapt_opt_field = document.getElementById("adapt_option_field");
var txt_adapt_field_len = document.getElementById("adapt_field_len");
var txt_discont_indi = document.getElementById("discont_indi");
var txt_rnd_accs_indi = document.getElementById("rnd_accs_indi");
var txt_es_prio_indi = document.getElementById("es_prio_indi");
var txt_five_flags = document.getElementById("five_flags");
var txt_option_field = document.getElementById("option_field");
var txt_stuff_adapt = document.getElementById("stuff_adapt");

var val_pcr_high = "";
var val_pcr_low = "";
var val_opcr_high = "";
var val_opcr_low = "";
var val_splice_cnt_down = "";
var val_ts_priv_data_len = "";
var val_priv_data_bytes = "";
var val_adapt_extent_len = "";
var val_ltw_flg = "";
var val_pcw_rate_flg = "";
var val_smls_splic_flg = "";
var val_reserved = "";
var val_adapt_option_field = "";

var val_adapt_field_len = "";
var val_discont_indi = "";
var val_rnd_accs_indi = "";
var val_es_prio_indi = "";
var val_five_flags = "";
var val_option_field = "";
var val_stuff_adapt = "";


var ts_optional_parse = (blob) => {
    console.log("optional_field: "+ dump_blob(blob,0) );
    let temp_high = (blob[0]<<24)+(blob[1]<<16)+(blob[2]<<8)+blob[3];
    let temp_low = (blob[4]<<8)+blob[5];
    let pcr_value = BigInt(temp_high*0x10000);
    pcr_value += BigInt(temp_low);
    // console.log("bigInt = "+ pcr_value + "(0x" + pcr_value.toString(16) + ")" );
    val_pcr_high = pcr_value;   //(temp_high*0x10000000) + val_pcr_low;
    val_pcr_low = "--";

    temp_high = (blob[6]<<8)+blob[7];
    temp_low = (blob[8]<<24)+(blob[9]<<16)+(blob[10]<<8)+blob[11];
    pcr_value = BigInt(temp_high*0x100000000);
    pcr_value += BigInt(temp_low);
    // console.log("bigInt = "+ pcr_value + "(0x" + pcr_value.toString(16) + ")" );

    val_opcr_high = pcr_value;  //((blob[6]&0xFF)<<40)+((blob[7]&0xFF)<<32)+((blob[8]&0xFF)<<24)+((blob[9]&0xFF)<<16)+((blob[10]&0xFF)<<8)+(blob[11]&0xFF);
    val_opcr_low = pcr_value;  //" ";
    val_splice_cnt_down = blob[12];
    val_ts_priv_data_len = blob[13];
    let offset = 14+val_ts_priv_data_len;
    val_priv_data_bytes = "[" + dump_blob( blob.slice(14,offset), 0 ).substring(0, 14)+"... ]";        /* transport private data */
    // console.log(dump_blob( blob.slice(14,offset), 0 ));

    val_adapt_extent_len = blob[offset];
    offset++;
    val_ltw_flg = (blob[offset]>>7)&0x01;
    val_pcw_rate_flg = (blob[offset]>>6)&0x01;
    val_smls_splic_flg = (blob[offset]>>5)&0x01;
    // console.log( blob[offset] + ", ltw:"+val_ltw_flg+", pcw:"+val_pcw_rate_flg+", splic:"+val_smls_splic_flg);

    let ltw_valid_flag;
    let ltw_offset;
    let piecewise_rate;
    let splice_type;
    val_reserved = blob[offset]&0x1F;
    if (val_ltw_flg ==1) {
        ltw_valid_flag = (blob[offset]>>7)&0x01;
        ltw_offset = ((blob[offset]<<8)+blob[offset+1])&0x7F;
        offset+=2;
    }
    if (val_pcw_rate_flg ==1) {
        piecewise_rate = ((blob[offset]<<16)+(blob[offset+1]<<8)+blob[offset+2])&0x3FFFFF;
        offset+=3;
    }
    if (val_smls_splic_flg ==1) {
        splice_type = (blob[offset]>>4)&0x0F;
        // let piecewise_rate = ((blob[offset]<<16)+(blob[offset+1]<<8)+blob[offset+2])&0x3FFFFF;
        offset+=5;
    }

    // console.log("val_ltw_flg:"+val_ltw_flg+",val_pcw_rate_flg:"+val_pcw_rate_flg+",val_smls_splic_flg:"+val_smls_splic_flg);

    val_adapt_option_field = "";
    if (val_ltw_flg!=0) {
        val_adapt_option_field += "<sub>ltw_valid_flag:</sub>"+ltw_valid_flag+", <sub>ltw_offset:</sub>"+ltw_offset+"<br/>";
    }
    if (val_pcw_rate_flg != 0) {
        val_adapt_option_field += "<sub>piecewise_rate:</sub>"+piecewise_rate+"<br/>";
    }
    if (val_smls_splic_flg != 0) {
        val_adapt_option_field += "<sub>splice_type</sub>:"+splice_type+"<br/>";
    }
    // val_option_field = "";
    // val_stuff_adapt = "";
}


var set_result = () => {
    txt_syncbyte.innerHTML = "<sub>Sync:</sub>"+val_syncbyte+"(0x"+val_syncbyte.toString(16)+")";        // must be 0x47
    txt_ts_error_indi.innerHTML = "<sub>ts_err:</sub>"+val_ts_error_indi;
    txt_pusi.innerHTML = "<sub>pusi:</sub>"+val_pusi;
    txt_ts_priority.innerHTML = "<sub>ts_prio:</sub>"+val_ts_priority;
    txt_pid.innerHTML = "<sub>PID:</sub>"+val_pid+"(0x"+val_pid.toString(16)+")";
    txt_ts_scrmb_ctrl.innerHTML = "<sub>scrmbl:</sub>"+val_ts_scrmb_ctrl;
    txt_adapt_field_ctrl.innerHTML = "<sub>a_fld_ctrl:</sub>"+val_adapt_field_ctrl;
    txt_cont_count.innerHTML = "<sub>cc:</sub>"+val_cont_count;

    if (val_adapt_field_len != "") {
        txt_adapt_field_len.innerHTML = "<sub>a_fld_len:</sub>"+val_adapt_field_len;
        txt_discont_indi.innerHTML = "<sub>dis_cnt:</sub>"+val_discont_indi;
        txt_rnd_accs_indi.innerHTML = "<sub>rnd_acs:</sub>"+val_rnd_accs_indi;
        txt_es_prio_indi.innerHTML = "<sub>es_prio:</sub>"+val_es_prio_indi;
        txt_pcr_flg.innerHTML = "<sub>pcr_f:</sub>"+val_pcr_flg;
        txt_opcr_flg.innerHTML = "<sub>opcr_f:</sub>"+val_opcr_flg;
        txt_splc_pont_flg.innerHTML = "<sub>spl_pnt:</sub>"+val_splc_pont_flg;
        txt_ts_priv_flg.innerHTML = "<sub>ts_priv:</sub>"+val_ts_priv_flg;
        txt_adapt_extent_flg.innerHTML = "<sub>adt_ext:</sub>"+val_adapt_extent_flg;
        txt_option_field.innerHTML = "<sub>optional fields</sub> ("+(val_adapt_field_len-2)+"<sub>bytes</sub>)";
        txt_stuff_adapt.innerHTML = "<sub>stuff bytes</sub>";
    } else {
        txt_adapt_field_len.innerHTML = "";
        txt_discont_indi.innerHTML = "";
        txt_rnd_accs_indi.innerHTML = "";
        txt_es_prio_indi.innerHTML = "";
        txt_pcr_flg.innerHTML = "";
        txt_opcr_flg.innerHTML = "";
        txt_splc_pont_flg.innerHTML = "";
        txt_ts_priv_flg.innerHTML = "";
        txt_adapt_extent_flg.innerHTML = "";
        txt_option_field.innerHTML = "";
        txt_stuff_adapt.innerHTML = "";
    }

    document.getElementById("payload_hex").innerText = dump_blob(val_payload, 0);
}


var set_option_parse_result = () => {

    txt_pcr_high.innerHTML = "<sub>PCR:</sub>"+ val_pcr_high+"(0x"+val_pcr_high.toString(16).toUpperCase()+")";
    txt_pcr_low.innerHTML = val_pcr_low.toString(16);   //"--";
    txt_opcr_high.innerHTML = "--";
    txt_opcr_low.innerHTML = "<sub>OCPR:</sub>"+val_opcr_high+"(0x"+val_opcr_high.toString(16).toUpperCase()+")";
    txt_splice_cnt_down.innerHTML = "<sub>splc_cntdwn:</sub>"+val_splice_cnt_down
    txt_ts_priv_data_len.innerHTML = "<sub>ts_priv_len:</sub>"+val_ts_priv_data_len
    txt_priv_data_bytes.innerHTML = "<sub>priv_data:</sub>"+val_priv_data_bytes

    txt_adapt_extent_len.innerHTML = "<sub>adt_ext_len:</sub>"+val_adapt_extent_len
    txt_ltw_flg.innerHTML = "<sub>ltw_flg:</sub>"+val_ltw_flg
    txt_pcw_rate_flg.innerHTML = "<sub>pcw_rat_flg:</sub>"+val_pcw_rate_flg
    txt_smls_splic_flg.innerHTML = "<sub>sml_splic_flg:</sub>"+val_smls_splic_flg
    txt_reserved.innerHTML = "<sub>reserved:</sub>"+val_reserved
    txt_adapt_opt_field.innerHTML = val_adapt_option_field;

    txt_adapt_field_len.innerHTML = "<sub>adpt_fld_len:</sub>"+val_adapt_field_len
    txt_discont_indi.innerHTML = "<sub>discnt_indi:</sub>"+val_discont_indi
    txt_rnd_accs_indi.innerHTML = "<sub>rnd_acs_indi:</sub>"+val_rnd_accs_indi
    txt_es_prio_indi.innerHTML = "<sub>es_prio_indi:</sub>"+val_es_prio_indi
    txt_option_field.innerHTML = "<sub>opt_fld:</sub>"+val_option_field
    txt_stuff_adapt.innerHTML = "<sub>stuff:</sub>"+val_stuff_adapt

    // if (val_ltw_flg ==1) {
    //     let ltw_valid_flag = (blob[offset]>>7)&0x01;
    //     let ltw_offset = ((blob[offset]<<8)+blob[offset+1])&0x7F;
    //     offset+=2;
    // }
    // if (val_pcw_rate_flg ==1) {
    //     let piecewise_rate = ((blob[offset]<<16)+(blob[offset+1]<<8)+blob[offset+2])&0x3FFFFF;
    //     offset+=3;
    // }
    // if (val_smls_splic_flg ==1) {
    //     let splice_type = (blob[offset]>>4)&0x0F;
    //     // let piecewise_rate = ((blob[offset]<<16)+(blob[offset+1]<<8)+blob[offset+2])&0x3FFFFF;
    //     offset+=5;
    // }
    // offset = val_adapt_extent_len;

}
    
var get_ts_packet = (buffer) => {
    return buffer.slice(0, 188);
}


var ts_file_changed = (imgsrc) => {    /* when ThumbNail file upload succed. */
    let loadingfiles = document.getElementById("dvbstp_file_in");  //.dataTransfer.files;
    console.log(" 파일"+ loadingfiles.files[0].name +" .. Loading ..");
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        let buffer = new Uint8Array(reader.result);
        let ts_packet = get_ts_packet(buffer);
        console.log("check : \n" + dump_blob(ts_packet,0) );
        ts_header_parse(ts_packet);
        set_result();
    });
    reader.readAsArrayBuffer(loadingfiles.files[0]);     //    - File이나 Blob의 바이너리 데이터를 읽어서 ArrayBuffer로 반환
}

var ts_from_text = () => {
    let long_text = document.getElementById("dvbstp_packet").value;
    console.log("test용 문자열: " + long_text );
    let blob = convert_text_to_blob(long_text);

    console.log("변환한 값: " );
    for (let i=0; i<blob.length; i++) {
        console.log(blob[i]);
    }
 
    ts_header_parse(blob);
    set_result();
}


window.onload = function main() {
    // set_result();
}


/* **************************
* some utility funtions.. 
*/
var convert_text_to_blob = (inputtext) => {
    var str_array;
    if ( inputtext.indexOf(",") >= 0) {
        console.log("HAS comma");
        str_array = inputtext.split(',');
    } else {
        console.log("No Comma. Split with SPACE");
        str_array = inputtext.split(' ');
    }

    var ia = []; // new Uint8Array();
    for (let i=0; i<str_array.length; i++) {
        console.log(" 0x"+str_array[i] );
        ia.push( (parseInt(str_array[i], 16) & 0xFF) );         /// TODO:  여기에서 str_array[i] 의 값을 HEX 문자열에서 UINT8로 바꾸어 주어야 함.
    }
    return ia;
}

var dump_blob = (data, start_idx) => {
    var dump_str = ""; 
    for (let i= start_idx; i< data.length; i++) {
        dump_str += data[i].toString(16)+" ";
    }
    return dump_str;
}

