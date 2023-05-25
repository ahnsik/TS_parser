/*
    pat_parser.js
    - mpeg ts PAT table parser
*/

var dom_tid = document.getElementById("table_id");
var dom_ss_indicator = document.getElementById("section_syntax_indicator");
    var dom_mustbe_0 = document.getElementById("mustbe_0");
    var dom_reserved_1 = document.getElementById("reserved_1");
var dom_section_len = document.getElementById("section_len");
var dom_ts_id_h = document.getElementById("ts_id_high");
var dom_ts_id_l = document.getElementById("ts_id_low");
    var dom_reserved_2 = document.getElementById("reserved_2");
var dom_ver_num = document.getElementById("version_num");
var dom_cur_next_indi = document.getElementById("cur_next_indi");
var dom_section_num = document.getElementById("section_num");
var dom_last_section_num = document.getElementById("last_section_num");
var dom_prgm_num = document.getElementById("program_num");
    var dom_reserved_3 = document.getElementById("reserved_3");
var dom_pmt_pid = document.getElementById("pmt_pid");
var dom_crc32 = document.getElementById("crc_32");


var val_tid ="";
var val_ss_indicator ="";
    var val_mustbe_0 ="";
    var val_reserved_1 ="";
var val_section_len ="";
var val_ts_id ="";
    var val_reserved_2 ="";
var val_ver_num ="";
var val_cur_next_indi ="";
var val_section_num ="";
var val_last_section_num ="";
var val_prgm_num ="";
    var val_reserved_3 ="";
var val_pmt_pid ="";
var val_crc32 ="";


var pat_parse = (blob) => {
    val_tid = blob[0];
    val_ss_indicator = (blob[1]>>7)&0x01;
    val_mustbe_0 = (blob[1]>>6)&0x01;       
        dom_mustbe_0.style.backgroundColor=(val_mustbe_0)?"RED":"";
    val_reserved_1 = (blob[1]>>5)&0x03;
        dom_reserved_1.style.backgroundColor=(val_reserved_1!=3)?"RED":"";
    val_section_len = (((blob[1]&0x0F)<<8)|blob[2]);
    val_ts_id = ((blob[3]<<8)|blob[4]);
    val_reserved_2 = (blob[5]>>6)&0x03;
        dom_reserved_2.style.backgroundColor=(val_reserved_2!=3)?"RED":"";
    val_ver_num = (blob[5]>>1)&0x1F;
    val_cur_next_indi = blob[5]&0x01;
    val_section_num = blob[6];
    val_last_section_num = blob[7];
console.log("tid:"+val_tid+",indi:"+val_ss_indicator+",section_len:"+val_section_len
        +", tsid:"+val_ts_id+",ver_num:"+val_ver_num+", cn_indi:"+val_cur_next_indi
        +", section_num:"+val_section_num+",last_sec_num:" +val_last_section_num );
    let offset = 8;
    do {
        val_prgm_num = ((blob[offset]<<8)|blob[offset+1]);
        val_reserved_3 = (blob[offset+2]>>5)&0x07;
        val_pmt_pid = (((blob[offset+2]&0x1F)<<8)|blob[offset+3]);
console.log("program_num:"+val_prgm_num+",pmtpid:"+val_pmt_pid);
        offset += 4;
    } while ( val_pmt_pid!=0xFF );

    val_crc32 = ((blob[offset]<<24)|(blob[offset+1]<<16)|(blob[offset+2]<<8)|blob[offset+3]);

    // if ( (val_adapt_field_ctrl==1) || (val_adapt_field_ctrl==3) ) {     // payload 가 있을 때에만.
    //     console.log("offset="+offset);

    // }
    // val_payload = blob.slice(offset);

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

    document.getElementById("payload_hex").innerText = dump_blob(val_payload, 0);
    make_dsmcc_addr_link();
}

// var packet_kind_text = (pid) => {
//     txt_packetid.style.background="";
//     txt_pid.style.background="";
//     switch(pid) {
//         case 0x00: return "PAT (Program Association Table)";
//         case 0x01: return "CAT (Conditional Access Table)";
//         case 0x02: return "TSDT";
//         case 0x1FFF: {
//             txt_packetid.style.background="red";
//             txt_pid.style.background="red";
//             return "NULL packet";
//         }
//         default:
//         // case 0x03~0x0F: return "reserved";
//         // case 0x10~1FFe: return "NIT, PMT, etc..";
//             return "UNKNOWN";
//     }
// }

// var set_option_parse_result = () => {

//     if (val_pcr_base=="" && val_pcr_ext=="") {
//         txt_pcr_base.innerHTML = "";    txt_pcr_base.style.background="darkgray";
//         txt_pcr_ext.innerHTML = "";    txt_pcr_ext.style.background="darkgray";
//         document.getElementById("pcr_dummy").innerHTML="";
//         document.getElementById("pcr_reserve").innerHTML="";
//     } else {
//         txt_pcr_base.innerHTML = "<sub>PCR_base:</sub> 0x"+val_pcr_base+"...";
//         txt_pcr_ext.innerHTML = "<sub>PCR_ext:</sub>"+ val_pcr_ext+" (0x"+val_pcr_ext.toString(16).toUpperCase()+")";
//         txt_pcr_base.style.background="";
//         txt_pcr_ext.style.background="";
//         document.getElementById("pcr_dummy").innerHTML="<sub>-</sub>";
//         document.getElementById("pcr_reserve").innerHTML="<sub>reserved</sub>";
//     }
//     if (val_opcr_base=="" && val_opcr_ext=="") {
//         txt_opcr_base.innerHTML = "";   txt_opcr_base.style.background = "darkgray";
//         txt_opcr_ext.innerHTML = "";   txt_opcr_ext.style.background = "darkgray";
//         document.getElementById("opcr_dummy").innerHTML="";
//         document.getElementById("opcr_reserve").innerHTML="";
//     } else {
//         txt_opcr_base.innerHTML = "<sub>OPCR_base:</sub> 0x"+val_opcr_base+"...";
//         txt_opcr_ext.innerHTML = "<sub>OPCR_ext:</sub>"+ val_opcr_ext+" (0x"+val_opcr_ext.toString(16).toUpperCase()+")";
//         txt_opcr_base.style.background="";
//         txt_opcr_ext.style.background="";
//         document.getElementById("opcr_dummy").innerHTML="<sub>OPCR_base</sub>";
//         document.getElementById("opcr_reserve").innerHTML="<sub>reserved</sub>";
//     }
//     if (val_splc_pont_flg) {
//         txt_splice_cnt_down.innerHTML = "<sub>splc_cntdwn:</sub>"+val_splice_cnt_down+" (0x"+val_splice_cnt_down.toString(16).toUpperCase()+")";
//         txt_splice_cnt_down.style.background="";
//     } else {
//         txt_splice_cnt_down.innerHTML = "";
//         txt_splice_cnt_down.style.background="darkgray";
//     }
//     if (val_ts_priv_flg) {
//         txt_ts_priv_data_len.innerHTML = "<sub>ts_priv_len:</sub>"+val_ts_priv_data_len+" (0x"+val_ts_priv_data_len.toString(16).toUpperCase()+")";
//         txt_ts_priv_data_len.style.background="darkgray";
//         txt_priv_data_bytes.innerHTML = "<sub>priv_data:</sub>"+val_priv_data_bytes
//         txt_priv_data_bytes.style.background="";
//     } else {
//         txt_ts_priv_data_len.innerHTML = "";
//         txt_ts_priv_data_len.style.background="darkgray";
//         txt_priv_data_bytes.innerHTML = "";
//         txt_priv_data_bytes.style.background="darkgray";
//     }

//     if (val_adapt_extent_flg) {
//         txt_adapt_extent_len.innerHTML = "<sub>adt_ext_len:</sub>"+val_adapt_extent_len+" (0x"+val_adapt_extent_len.toString(16)+")";
//         txt_adapt_extent_len.style.background="";
//         txt_ltw_flg.innerHTML = "<sub>ltw_flg:</sub>"+val_ltw_flg;
//         txt_ltw_flg.style.background="";
//         if (val_ltw_flg) {
//             txt_ltw_valid_flg.innerHTML = "<sub>valid:</sub>"+val_ltw_valid_flg;
//             txt_ltw_valid_flg.style.background = "";
//             txt_ltw_offset.innerHTML = "<sub>ltw_offset:</sub>"+val_ltw_offset+" (0x"+val_ltw_offset.toString(16).toUpperCase()+")";
//             txt_ltw_offset.style.background="";
//         } else {
//             txt_ltw_valid_flg.innerHTML = "";
//             txt_ltw_valid_flg.style.background="darkgray";
//             txt_ltw_offset.innerHTML = "";
//             txt_ltw_offset.style.background="darkgray";
//         }
//         txt_pcw_rate_flg.innerHTML = "<sub>rate_flg:</sub>"+val_pcw_rate_flg;
//         txt_pcw_rate_flg.style.background="";
//         if (val_pcw_rate_flg) {
//             // txt_pcw_rate_flg.innerHTML = "<sub>piecewise_rate:</sub>"+val_pcw_rate_flg+" (0x"+val_pcw_rate_flg.toString(16).toUpperCase()+")";
//             txt_piecewise_rate.innerHTML = "<sub>piecewise_rate:</sub>"+val_piecewise_rate+" (0x"+val_piecewise_rate.toString(16).toUpperCase()+")";
//             txt_piecewise_rate.style.background = "";
//         } else {
//             txt_piecewise_rate.innerHTML = "";
//             txt_piecewise_rate.style.background = "darkgray";
//         }
//         txt_smls_splic_flg.innerHTML = "<sub>splic_flg:</sub>"+val_smls_splic_flg;
//         txt_smls_splic_flg.style.background="";
//         if (val_smls_splic_flg) {
//             txt_splice_type.innerHTML = "<sub>splice_type:</sub>"+val_splice_type+"(0x"+val_splice_type.toString(16).toUpperCase()+")";
//             txt_splice_type.style.background = "";
//             txt_DTS_next_AU.innerHTML = "<sub>DTS_next_AU:</sub>"+val_DTS_nextAU.toString(16);
//             txt_DTS_next_AU.style.background="";
//         } else {
//             txt_splice_type.innerHTML = "";
//             txt_splice_type.style.background="darkgray";
//             txt_DTS_next_AU.innerHTML = "";
//             txt_DTS_next_AU.style.background="darkgray";
//         }

//     } else {
//         txt_adapt_extent_len.innerHTML = "";
//         txt_adapt_extent_len.style.background="darkgray";
//         txt_ltw_flg.innerHTML = "";
//         txt_ltw_flg.style.background="darkgray";
//         txt_pcw_rate_flg.innerHTML ="";
//         txt_pcw_rate_flg.style.background="darkgray";
//         txt_ltw_valid_flg.innerHTML = "";
//         txt_ltw_valid_flg.style.background="darkgray";
//         txt_ltw_offset.innerHTML = "";
//         txt_ltw_offset.style.background="darkgray";
//         txt_piecewise_rate.innerHTML ="";
//         txt_piecewise_rate.style.background="darkgray";
//         txt_smls_splic_flg.innerHTML = "";
//         txt_smls_splic_flg.style.background="darkgray";
//         txt_splice_type.innerHTML = "";
//         txt_splice_type.style.background="darkgray";
//         txt_DTS_next_AU.innerHTML = "";
//         txt_DTS_next_AU.style.background="darkgray";
//         txt_reserved.innerHTML = "";
//         txt_reserved.style.background="darkgray";
//         txt_reserved2.innerHTML = "";
//         txt_reserved2.style.background="darkgray";
//     }
//     // txt_adapt_opt_field.innerHTML = val_adapt_option_field;
    
// }

var pat_file_changed = () => {    /* 파일로 부터 읽어 들일 때. */
    let loadingfiles = document.getElementById("packet_file_in");
    console.log(" 파일"+ loadingfiles.files[0].name +" .. Loading ..");
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        let buffer = new Uint8Array(reader.result);
        let pat_packet = get_ts_packet(buffer);
        // console.log("check : \n" + dump_blob(pat_packet,0) );
        document.getElementById("packet_dump").value = dump_blob(pat_packet,0);
        pat_parse(pat_packet);
        set_result();
    });
    reader.readAsArrayBuffer(loadingfiles.files[0]);     //    - File이나 Blob의 바이너리 데이터를 읽어서 ArrayBuffer로 반환
}

var pat_from_text = () => {
    let long_text = document.getElementById("packet_dump").value;
    console.log("test용 문자열: " + long_text );
    let blob = convert_text_to_blob(long_text);

    // console.log("변환한 값: " );
    // for (let i=0; i<blob.length; i++) {
    //     console.log(blob[i]);
    // }
    pat_parse(blob);
    set_result();
}

var read_offset_188bytes = () => {
    let offset_value = document.getElementById("read_offset").value;
    read_offset = offset_value;
    pat_file_changed();
}

var next_188bytes= () => {
    read_offset += 188;
    document.getElementById("read_offset").value = read_offset;
    pat_file_changed();
}

var make_dsmcc_addr_link = () => {
    let link_tag = document.getElementById("goto_link");
    link_tag.innerHTML = "<a href='http://ccash.gonetis.com:88/TS_analyzer/DSMCC-addressable/index.html?payload="+dump_blob(val_payload, 0)+"'>DSMCC-addressable</a>";
}


window.onload = function main() {
    let payload_str = getParameterByName("payload");
    let text_area = document.getElementById("packet_dump");
    console.log("packet data:" + payload_str);
    text_area.innerText = payload_str;
    pat_from_text();
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

