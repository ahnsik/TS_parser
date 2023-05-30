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
var txt_packetid = document.getElementById("packet_id");
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

var dom_optional_field_detail = document.getElementById("optional_field_detail");


var val_syncbyte = "";
var val_ts_error_indi = "";
var val_pusi = "";
var val_ts_priority = "";
var val_pid = "";
var val_ts_scrmb_ctrl = "";
var val_adapt_field_ctrl = "";
var val_cont_count = "";
var val_adapt_field_len = 0;
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
var payload_start = 0;

var ts_header_parse = (blob) => {
    val_syncbyte = blob[0];
    val_ts_error_indi = (blob[1]>>7)&0x01;
    val_pusi = (blob[1]>>6)&0x01;
    val_ts_priority = (blob[1]>>5)&0x01;
    val_pid = ((blob[1]<<8)&0x1F00) | blob[2];
    val_ts_scrmb_ctrl = (blob[3]>>6)&0x03;
    val_adapt_field_ctrl = (blob[3]>>4)&0x03;
    val_cont_count = blob[3]&0x0F;

    let offset = 4;
    if ( (val_adapt_field_ctrl==2) || (val_adapt_field_ctrl==3) ) {
        val_adapt_field_len = blob[4];
        let temp_byte = blob[5];
        val_discont_indi = (temp_byte>>7)&0x01;
        val_rnd_accs_indi = (temp_byte>>6)&0x01;
        val_es_prio_indi = (temp_byte>>5)&0x01;
        val_pcr_flg = (temp_byte>>4)&0x01;
        val_opcr_flg = (temp_byte>>3)&0x01;
        val_splc_pont_flg = (temp_byte>>2)&0x01;
        val_ts_priv_flg = (temp_byte>>1)&0x01;
        val_adapt_extent_flg = (temp_byte)&0x01;
        ts_optional_parse(blob.slice(offset+2) );
        set_option_parse_result();
        offset += (val_adapt_field_len)+1;      // +1 은 val_adapt_field_len 의 값으로 parsing 했으므로.
    } else {
        val_adapt_field_len = 0;
    }

    if ( (val_adapt_field_ctrl==1) || (val_adapt_field_ctrl==3) ) {     // payload 가 있을 때에만.
        if (val_pusi) {
            payload_start = blob[offset];
            offset++;
        } else {
            payload_start = -1;
        }

        console.log("offset="+offset);

    }
    val_payload = blob.slice(offset);

}


var txt_pcr_base = document.getElementById("pcr_base");
var txt_pcr_ext = document.getElementById("pcr_ext");
var txt_opcr_base = document.getElementById("opcr_base");
var txt_opcr_ext = document.getElementById("opcr_ext");
var txt_splice_cnt_down = document.getElementById("splice_cnt_down");
var txt_ts_priv_data_len = document.getElementById("ts_priv_data_length");
var txt_priv_data_bytes = document.getElementById("priv_data_bytes");
var txt_adapt_extent_len = document.getElementById("adapt_extent_length");
var txt_ltw_flg = document.getElementById("ltw_flg");
var txt_pcw_rate_flg = document.getElementById("pcw_rate_flg");
var txt_smls_splic_flg = document.getElementById("smls_splic_flg");
var txt_reserved = document.getElementById("reserved");
// var txt_adapt_opt_field = document.getElementById("adapt_option_field");

var txt_ltw_valid_flg = document.getElementById("ltw_valid_flag");
var txt_ltw_offset = document.getElementById("ltw_offset");
var txt_reserved2 = document.getElementById("reserved2");
var txt_piecewise_rate = document.getElementById("piecewise_rate");
var txt_splice_type = document.getElementById("splice_type");
var txt_DTS_next_AU = document.getElementById("DTS_next_AU");

var val_pcr_base = "";
var val_pcr_ext = "";
var val_opcr_base = "";
var val_opcr_ext = "";
var val_splice_cnt_down = "";
var val_ts_priv_data_len = "";
var val_priv_data_bytes = "";
var val_adapt_extent_len = "";
var val_ltw_flg = "";
var val_pcw_rate_flg = "";
var val_smls_splic_flg = "";
var val_reserved = "";
// var val_adapt_option_field = "";
let val_ltw_valid_flg = "";
let val_ltw_offset = "";
let val_piecewise_rate = "";
let val_splice_type = "";
let val_DTS_nextAU = "";

var ts_optional_parse = (blob) => {
    console.log("optional_field: "+ dump_blob(blob,0) );

    let temp_high = 0;
    let temp_low = 0;
    let offset = 0;
    if (val_pcr_flg==1) {
        temp_high = (blob[offset+0]<<24)+(blob[offset+1]<<16)+(blob[offset+2]<<8)+(blob[offset+3]);
        temp_low = (blob[offset+4]<<8)+blob[offset+5];
        val_pcr_base = temp_high.toString(16).toUpperCase();
        val_pcr_ext = (temp_low&0x1FF);
        offset += 6;
    } else {
        val_pcr_base = "";
        val_pcr_ext = "";
    }
    if (val_opcr_flg==1) {
        temp_high = (blob[offset+0]<<24)+(blob[offset+1]<<16)+(blob[offset+2]<<8)+(blob[offset+3]);
        temp_low = (blob[offset+4]<<8)+blob[offset+5];
        val_opcr_base = temp_high.toString(16).toUpperCase();
        val_opcr_ext = (temp_low&0x1FF);
        offset += 6;
    } else {
        val_opcr_base = "";
        val_opcr_ext = "";
    }

    if (val_splc_pont_flg) {
        val_splice_cnt_down = blob[offset++];
    } else {
        val_splice_cnt_down = "";
    }
    if (val_ts_priv_flg) {
        val_ts_priv_data_len = blob[offset++];
        let end_offset = offset+val_ts_priv_data_len;
        let priv_data = blob.slice(offset,end_offset);
        val_priv_data_bytes = "[" + dump_blob( priv_data, 0 ).substring(0, 14)+" ... ] (" +priv_data.length+" bytes)";        /* transport private data */
        // console.log(dump_blob( blob.slice(14,offset), 0 ));
        offset = end_offset;
    } else {
        val_ts_priv_data_len = 0;
        val_priv_data_bytes = "";
    }
    if (val_adapt_extent_flg) {
        val_adapt_extent_len = blob[offset];
        offset++;
        let temp_byte = blob[offset];
        offset++;
        console.log("offset="+offset+", blob dump: " + dump_blob(blob, offset) );
        val_ltw_flg = (temp_byte>>7)&0x01;
        val_pcw_rate_flg = (temp_byte>>6)&0x01;
        val_smls_splic_flg = (temp_byte>>5)&0x01;
        if (val_ltw_flg) {
            val_ltw_valid_flg = (blob[offset]>>7)&0x01; 
            val_ltw_offset = ((blob[offset]<<8)+(blob[offset+1]))&0x7FFF;
            offset+=2;
        }
        if (val_pcw_rate_flg) {
            val_piecewise_rate = ((blob[offset]<<16)+(blob[offset+1]<<8)+(blob[offset+2]))&0x3FFFFF;
            offset+=3;
        }
        if (val_smls_splic_flg) {
            val_splice_type = (blob[offset]>>4)&0x0F;
            let t1 = (blob[offset]>>1)&0x07;
            let t2 = ((blob[offset+1]<<16)+blob[offset+2])>>1;
            let t3 = ((blob[offset+3]<<16)+blob[offset+4])>>1;
            val_DTS_nextAU = (t1<<14)+(t2<<7)+t3;
            offset+=5;
        }
    } else {
        val_adapt_extent_len = 0;
        val_ltw_flg = 0;
        val_pcw_rate_flg = 0;
        val_smls_splic_flg = 0;
        val_ltw_valid_flg = 0;
        val_ltw_offset = 0;
        val_piecewise_rate = 0;
        val_splice_type = 0;
        val_DTS_nextAU = 0;
    }
    // console.log( blob[offset] + ", ltw:"+val_ltw_flg+", pcw:"+val_pcw_rate_flg+", splic:"+val_smls_splic_flg);

    val_reserved = blob[offset]&0x1F;
}


var set_result = () => {
    txt_syncbyte.innerHTML = "<sub>Sync:</sub>"+val_syncbyte+" (0x"+val_syncbyte.toString(16)+")";        // must be 0x47
    if (val_syncbyte != 0x47) {         // syncbyte 의 값은 항상 0x47 이어야만 함. 아니라면 TS패킷이 아닌 것.
        txt_syncbyte.style.background = "red";
    } else {
        txt_syncbyte.style.background = "";
    }
    txt_ts_error_indi.innerHTML = "<sub>ts_err:</sub>"+val_ts_error_indi;
    txt_ts_error_indi.style.background = (val_ts_error_indi != 0) ? "red" : "" ;
    txt_pusi.innerHTML = "<sub>pusi:</sub>"+val_pusi;
    txt_pusi.style.background = (val_pusi) ? "cyan" : "" ;
    txt_ts_priority.innerHTML = "<sub>ts_prio:</sub>"+val_ts_priority;
    txt_pid.innerHTML = "<sub>PID:</sub>"+val_pid+"(0x"+val_pid.toString(16).toUpperCase()+")";
    txt_packetid.innerText = packet_kind_text(val_pid);
    txt_ts_scrmb_ctrl.innerHTML = "<sub>scrmbl:</sub>"+val_ts_scrmb_ctrl;
    txt_ts_scrmb_ctrl.style.background = (val_ts_scrmb_ctrl != 0) ? "orange" : "" ;
    txt_adapt_field_ctrl.innerHTML = "<sub>a_fld_ctrl:</sub>"+val_adapt_field_ctrl;
    txt_cont_count.innerHTML = "<sub>cc:</sub>"+val_cont_count;

    console.log("val_adapt_field_len="+val_adapt_field_len);

    if ( (val_adapt_field_ctrl==2) || (val_adapt_field_ctrl==3) ) {
        dom_optional_field_detail.style.display="block";
        txt_adapt_field_len.style.background = "";
        txt_discont_indi.style.background = "";
        txt_rnd_accs_indi.style.background = "";
        txt_es_prio_indi.style.background = "";
        txt_pcr_flg.style.background = "";
        txt_opcr_flg.style.background = "";
        txt_splc_pont_flg.style.background = "";
        txt_ts_priv_flg.style.background = "";
        txt_adapt_extent_flg.style.background = "";
        txt_option_field.style.background = "";
        txt_stuff_adapt.style.background = "";
        txt_adapt_field_len.innerHTML = "<sub>a_fld_len:</sub>"+val_adapt_field_len+" (0x"+val_adapt_field_len.toString(16).toUpperCase()+")";
        txt_discont_indi.innerHTML = "<sub>dis_cnt:</sub>"+val_discont_indi;
        txt_rnd_accs_indi.innerHTML = "<sub>rnd_acs:</sub>"+val_rnd_accs_indi;
        txt_es_prio_indi.innerHTML = "<sub>es_prio:</sub>"+val_es_prio_indi;
        txt_pcr_flg.innerHTML = "<sub>pcr_f:</sub>"+val_pcr_flg;
        txt_opcr_flg.innerHTML = "<sub>opcr_f:</sub>"+val_opcr_flg;
        txt_splc_pont_flg.innerHTML = "<sub>spl_pnt:</sub>"+val_splc_pont_flg;
        txt_ts_priv_flg.innerHTML = "<sub>ts_priv:</sub>"+val_ts_priv_flg;
        txt_adapt_extent_flg.innerHTML = "<sub>adt_ext:</sub>"+val_adapt_extent_flg;
        txt_option_field.innerHTML = "<sub>optional fields ("+(val_adapt_field_len-2)+"bytes)</sub>";
        txt_stuff_adapt.innerHTML = "<sub>stuff bytes</sub>";
    } else {
        dom_optional_field_detail.style.display="none";
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

    if (val_pusi && (payload_start > 0)) {
        let old_packet = val_payload.slice(0, payload_start-1);
        let new_packet = val_payload.slice(payload_start, val_payload.length);
        document.getElementById("payload_hex").innerText = dump_blob(old_packet, 0);
        document.getElementById("payload_hex_next").innerText = dump_blob(new_packet, 0);
    } else {
        document.getElementById("payload_hex").innerText = dump_blob(val_payload, 0);
        document.getElementById("payload_hex_next").innerText = "";
    }

    let display_pid = document.getElementById("payload_1_pid");
    display_pid.innerText = val_pid+" (0x"+val_pid.toString(16).toUpperCase()+")";

    switch(val_payload[0]) {
        case 0x00:      // PAT
            if (val_pid==0) {
                display_pid.innerHTML += " Table_id=" +val_payload[0]+" (0x"+val_payload[0].toString(16).toUpperCase() +") is PAT.";
                display_pid.style.backgroundColor = "lightgreen";
            }
            break;
        case 0x02:      // PMT
            display_pid.innerHTML += " Table_id=" +val_payload[0]+" (0x"+val_payload[0].toString(16).toUpperCase() +") is PMT.";
            display_pid.style.backgroundColor = "lightblue";
            break;
        case 0x3F:
            display_pid.innerHTML += " Table_id=" +val_payload[0]+" (0x"+val_payload[0].toString(16).toUpperCase() +") is DSM-CC_addressable.";
            display_pid.style.backgroundColor = "lightyellow";
            break;
        default:
            display_pid.style.backgroundColor = "";
            break;
    }
    make_link();
}

var packet_kind_text = (pid) => {
    txt_packetid.style.background="";
    txt_pid.style.background="";
    switch(pid) {
        case 0x00: return "PAT (Program Association Table)";
        case 0x01: return "CAT (Conditional Access Table)";
        case 0x02: return "TSDT";
        case 0x1FFF: {
            txt_packetid.style.background="red";
            txt_pid.style.background="red";
            return "NULL packet";
        }
        default:
        // case 0x03~0x0F: return "reserved";
        // case 0x10~1FFe: return "NIT, PMT, etc..";
            return "UNKNOWN";
    }
}

var set_option_parse_result = () => {

    if (val_pcr_base=="" && val_pcr_ext=="") {
        txt_pcr_base.innerHTML = "";    txt_pcr_base.style.background="darkgray";
        txt_pcr_ext.innerHTML = "";    txt_pcr_ext.style.background="darkgray";
        document.getElementById("pcr_dummy").innerHTML="";
        document.getElementById("pcr_reserve").innerHTML="";
    } else {
        txt_pcr_base.innerHTML = "<sub>PCR_base:</sub> 0x"+val_pcr_base+"...";
        txt_pcr_ext.innerHTML = "<sub>PCR_ext:</sub>"+ val_pcr_ext+" (0x"+val_pcr_ext.toString(16).toUpperCase()+")";
        txt_pcr_base.style.background="";
        txt_pcr_ext.style.background="";
        document.getElementById("pcr_dummy").innerHTML="<sub>-</sub>";
        document.getElementById("pcr_reserve").innerHTML="<sub>reserved</sub>";
    }
    if (val_opcr_base=="" && val_opcr_ext=="") {
        txt_opcr_base.innerHTML = "";   txt_opcr_base.style.background = "darkgray";
        txt_opcr_ext.innerHTML = "";   txt_opcr_ext.style.background = "darkgray";
        document.getElementById("opcr_dummy").innerHTML="";
        document.getElementById("opcr_reserve").innerHTML="";
    } else {
        txt_opcr_base.innerHTML = "<sub>OPCR_base:</sub> 0x"+val_opcr_base+"...";
        txt_opcr_ext.innerHTML = "<sub>OPCR_ext:</sub>"+ val_opcr_ext+" (0x"+val_opcr_ext.toString(16).toUpperCase()+")";
        txt_opcr_base.style.background="";
        txt_opcr_ext.style.background="";
        document.getElementById("opcr_dummy").innerHTML="<sub>OPCR_base</sub>";
        document.getElementById("opcr_reserve").innerHTML="<sub>reserved</sub>";
    }
    if (val_splc_pont_flg) {
        txt_splice_cnt_down.innerHTML = "<sub>splc_cntdwn:</sub>"+val_splice_cnt_down+" (0x"+val_splice_cnt_down.toString(16).toUpperCase()+")";
        txt_splice_cnt_down.style.background="";
    } else {
        txt_splice_cnt_down.innerHTML = "";
        txt_splice_cnt_down.style.background="darkgray";
    }
    if (val_ts_priv_flg) {
        txt_ts_priv_data_len.innerHTML = "<sub>ts_priv_len:</sub>"+val_ts_priv_data_len+" (0x"+val_ts_priv_data_len.toString(16).toUpperCase()+")";
        txt_ts_priv_data_len.style.background="darkgray";
        txt_priv_data_bytes.innerHTML = "<sub>priv_data:</sub>"+val_priv_data_bytes
        txt_priv_data_bytes.style.background="";
    } else {
        txt_ts_priv_data_len.innerHTML = "";
        txt_ts_priv_data_len.style.background="darkgray";
        txt_priv_data_bytes.innerHTML = "";
        txt_priv_data_bytes.style.background="darkgray";
    }

    if (val_adapt_extent_flg) {
        txt_adapt_extent_len.innerHTML = "<sub>adt_ext_len:</sub>"+val_adapt_extent_len+" (0x"+val_adapt_extent_len.toString(16)+")";
        txt_adapt_extent_len.style.background="";
        txt_ltw_flg.innerHTML = "<sub>ltw_flg:</sub>"+val_ltw_flg;
        txt_ltw_flg.style.background="";
        if (val_ltw_flg) {
            txt_ltw_valid_flg.innerHTML = "<sub>valid:</sub>"+val_ltw_valid_flg;
            txt_ltw_valid_flg.style.background = "";
            txt_ltw_offset.innerHTML = "<sub>ltw_offset:</sub>"+val_ltw_offset+" (0x"+val_ltw_offset.toString(16).toUpperCase()+")";
            txt_ltw_offset.style.background="";
        } else {
            txt_ltw_valid_flg.innerHTML = "";
            txt_ltw_valid_flg.style.background="darkgray";
            txt_ltw_offset.innerHTML = "";
            txt_ltw_offset.style.background="darkgray";
        }
        txt_pcw_rate_flg.innerHTML = "<sub>rate_flg:</sub>"+val_pcw_rate_flg;
        txt_pcw_rate_flg.style.background="";
        if (val_pcw_rate_flg) {
            // txt_pcw_rate_flg.innerHTML = "<sub>piecewise_rate:</sub>"+val_pcw_rate_flg+" (0x"+val_pcw_rate_flg.toString(16).toUpperCase()+")";
            txt_piecewise_rate.innerHTML = "<sub>piecewise_rate:</sub>"+val_piecewise_rate+" (0x"+val_piecewise_rate.toString(16).toUpperCase()+")";
            txt_piecewise_rate.style.background = "";
        } else {
            txt_piecewise_rate.innerHTML = "";
            txt_piecewise_rate.style.background = "darkgray";
        }
        txt_smls_splic_flg.innerHTML = "<sub>splic_flg:</sub>"+val_smls_splic_flg;
        txt_smls_splic_flg.style.background="";
        if (val_smls_splic_flg) {
            txt_splice_type.innerHTML = "<sub>splice_type:</sub>"+val_splice_type+"(0x"+val_splice_type.toString(16).toUpperCase()+")";
            txt_splice_type.style.background = "";
            txt_DTS_next_AU.innerHTML = "<sub>DTS_next_AU:</sub>"+val_DTS_nextAU.toString(16);
            txt_DTS_next_AU.style.background="";
        } else {
            txt_splice_type.innerHTML = "";
            txt_splice_type.style.background="darkgray";
            txt_DTS_next_AU.innerHTML = "";
            txt_DTS_next_AU.style.background="darkgray";
        }

    } else {
        txt_adapt_extent_len.innerHTML = "";
        txt_adapt_extent_len.style.background="darkgray";
        txt_ltw_flg.innerHTML = "";
        txt_ltw_flg.style.background="darkgray";
        txt_pcw_rate_flg.innerHTML ="";
        txt_pcw_rate_flg.style.background="darkgray";
        txt_ltw_valid_flg.innerHTML = "";
        txt_ltw_valid_flg.style.background="darkgray";
        txt_ltw_offset.innerHTML = "";
        txt_ltw_offset.style.background="darkgray";
        txt_piecewise_rate.innerHTML ="";
        txt_piecewise_rate.style.background="darkgray";
        txt_smls_splic_flg.innerHTML = "";
        txt_smls_splic_flg.style.background="darkgray";
        txt_splice_type.innerHTML = "";
        txt_splice_type.style.background="darkgray";
        txt_DTS_next_AU.innerHTML = "";
        txt_DTS_next_AU.style.background="darkgray";
        txt_reserved.innerHTML = "";
        txt_reserved.style.background="darkgray";
        txt_reserved2.innerHTML = "";
        txt_reserved2.style.background="darkgray";
    }
    // txt_adapt_opt_field.innerHTML = val_adapt_option_field;
    
}
    
var get_ts_packet = (buffer, start_offset) => {
    let read_end = parseInt(start_offset)+188;
    console.log(" reading bytes from "+start_offset+" to "+read_end );
    return buffer.slice(start_offset,read_end);
}

var read_offset = 0;

var ts_file_changed = () => {    /* when ThumbNail file upload succed. */
    let loadingfiles = document.getElementById("ts_file_in");  //.dataTransfer.files;
    console.log(" 파일"+ loadingfiles.files[0].name +" .. Loading ..");
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        let buffer = new Uint8Array(reader.result);
        let ts_packet = get_ts_packet(buffer, read_offset);
        // console.log("check : \n" + dump_blob(ts_packet,0) );
        document.getElementById("ts_packet").value = dump_blob(ts_packet,0);
        ts_header_parse(ts_packet);
        set_result();
    });
    reader.readAsArrayBuffer(loadingfiles.files[0]);     //    - File이나 Blob의 바이너리 데이터를 읽어서 ArrayBuffer로 반환
}

var ts_from_text = () => {
    let long_text = document.getElementById("ts_packet").value;
    console.log("test용 문자열: " + long_text );
    let blob = convert_text_to_blob(long_text);

    // console.log("변환한 값: " );
    // for (let i=0; i<blob.length; i++) {
    //     console.log(blob[i]);
    // }
    ts_header_parse(blob);
    set_result();
}

var read_offset_188bytes = () => {
    let offset_value = document.getElementById("read_offset").value;
    read_offset = offset_value;
    ts_file_changed();
}

var next_188bytes= () => {
    read_offset = parseInt(read_offset)+188;
    document.getElementById("read_offset").value = read_offset;
    ts_file_changed();
}

var make_link = () => {
    let pat_link_tag = document.getElementById("goto_table");
    switch(val_payload[0]) {
        case 0x00:      // PAT
            pat_link_tag.innerHTML = "<a href='http://ccash.gonetis.com:88/TS_analyzer/PAT_packet/index.html?payload="+dump_blob(val_payload, 0)+"'>PAT parse</a>";
            break;
        case 0x02:      // PMT
            pat_link_tag.innerHTML = "<a href='http://ccash.gonetis.com:88/TS_analyzer/PMT_packet/index.html?payload="+dump_blob(val_payload, 0)+"'>PMT parse</a>";
            break;
        case 0x3F:
            pat_link_tag.innerHTML = "<a href='http://ccash.gonetis.com:88/TS_analyzer/DSMCC-addressable/index.html?payload="+dump_blob(val_payload, 0)+"'>DSMCC addressable parse</a>";
            break;
        default:
            break;
    }

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
        ia.push( (parseInt(str_array[i], 16) & 0xFF) );         /// TODO:  여기에서 str_array[i] 의 값을 HEX 문자열에서 UINT8로 바꾸어 주어야 함.
    }
    return ia;
}

//////////////////////////// 이런 종류의 parsing 할 때 기본적으로 사용되는 몇가지 함수들.
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
var dump_blob = (data, start_idx) => {
    var dump_str = ""; 
    for (let i= start_idx; i< data.length; i++) {
        dump_str += data[i].toString(16).toUpperCase()+" ";
    }
    return dump_str;
}

