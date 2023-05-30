/*
    cat_parser.js
    - mpeg ts CAT table parser
*/

var dom_tid = document.getElementById("table_id");
var dom_ss_indicator = document.getElementById("section_syntax_indicator");
    var dom_mustbe_0 = document.getElementById("mustbe_0");
    var dom_reserved_1 = document.getElementById("reserved_1");
var dom_section_len = document.getElementById("section_len");
    var dom_reserved_2 = document.getElementById("reserved_2");
    var dom_reserved_3 = document.getElementById("reserved_3");
var dom_ver_num = document.getElementById("version_num");
var dom_cur_next_indi = document.getElementById("cur_next_indi");
var dom_section_num = document.getElementById("section_num");
var dom_last_section_num = document.getElementById("last_section_num");
var dom_descriptor = document.getElementById("descriptor");
var dom_crc32 = document.getElementById("crc_32");


var val_tid ="";
var val_ss_indicator ="";
    var val_mustbe_0 ="";
    var val_reserved_1 ="";
var val_section_len ="";
    var val_reserved_2 ="";
var val_ver_num ="";
var val_cur_next_indi ="";
var val_section_num ="";
var val_last_section_num ="";
var val_descriptor ="";
var val_crc32 ="";


var cat_parse = (blob) => {
    val_tid = blob[0];
    val_ss_indicator = (blob[1]>>7)&0x01;
    val_mustbe_0 = (blob[1]>>6)&0x01;       
        dom_mustbe_0.style.backgroundColor=(val_mustbe_0)?"RED":"";
    val_reserved_1 = (blob[1]>>5)&0x03;
        dom_reserved_1.style.backgroundColor=(val_reserved_1!=3)?"RED":"";
    val_section_len = (((blob[1]&0x0F)<<8)|blob[2]);
 
    val_ver_num = (blob[5]>>1)&0x1F;
    val_cur_next_indi = blob[5]&0x01;
    val_section_num = blob[6];
    val_last_section_num = blob[7];
    dom_last_section_num.style.backgroundColor = (val_section_num > val_last_section_num) ? "RED" : "";
    let offset = 8;
    val_descriptor = blob.slice(offset);
    val_crc32 = ((blob[offset]<<24)|(blob[offset+1]<<16)|(blob[offset+2]<<8)|blob[offset+3]);
}


var set_result = () => {
    dom_tid.innerHTML="<sub>table_id:</sub>"+val_tid+" (0x"+val_tid.toString(16).toUpperCase()+")";
    dom_ss_indicator.innerHTML = "<sub>s_s_indi:</sub>"+val_ss_indicator;
    // dom_mustbe_0 = ;
    // dom_reserved_1 = ;
    dom_section_len.innerHTML = "<sub>section_length:</sub>"+val_section_len+" (0x"+val_section_len.toString(16).toUpperCase()+")";
    // dom_ts_id_h = document.getElementById("ts_id_high");
    // dom_reserved_2;
    dom_ver_num.innerHTML = "<sub>ver_num:</sub>"+val_ver_num+" (0x"+val_ver_num.toString(16).toUpperCase()+")";
    dom_cur_next_indi.innerHTML = "<sub>c_n_indi:</sub>"+val_cur_next_indi;
    dom_section_num.innerHTML = "<sub>section_num:</sub>"+val_section_num+" (0x"+val_section_num.toString(16).toUpperCase()+")";
    dom_last_section_num.innerHTML = "<sub>last_sec_num:</sub>"+val_last_section_num+" (0x"+val_last_section_num.toString(16).toUpperCase()+")";

    // dom_prgm_num.innerHTML = "<sub>program_number:</sub>"+val_prgm_num+" (0x"+val_prgm_num.toString(16).toUpperCase()+")";
    //     // var dom_reserved_3 = document.getElementById("reserved_3");
    // dom_pmt_pid.innerHTML = "<sub>pmt_pid:</sub>"+val_pmt_pid+" (0x"+val_pmt_pid.toString(16).toUpperCase()+")";
    dom_crc32.innerHTML = "<sub>CRC32:</sub>"+val_crc32+" (0x"+val_crc32.toString(16).toUpperCase()+")";

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

var cat_file_changed = () => {    /* 파일로 부터 읽어 들일 때. */
    let loadingfiles = document.getElementById("packet_file_in");
    console.log(" 파일"+ loadingfiles.files[0].name +" .. Loading ..");
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        let buffer = new Uint8Array(reader.result);
        let cat_packet = get_ts_packet(buffer);
        // console.log("check : \n" + dump_blob(cat_packet,0) );
        document.getElementById("packet_dump").value = dump_blob(cat_packet,0);
        pat_parse(cat_packet);
        set_result();
    });
    reader.readAsArrayBuffer(loadingfiles.files[0]);     //    - File이나 Blob의 바이너리 데이터를 읽어서 ArrayBuffer로 반환
}

var cat_from_text = () => {
    let long_text = document.getElementById("packet_dump").value;
    console.log("test용 문자열: " + long_text );
    let blob = convert_text_to_blob(long_text);

    // console.log("변환한 값: " );
    // for (let i=0; i<blob.length; i++) {
    //     console.log(blob[i]);
    // }
    cat_parse(blob);
    set_result();
}

var read_offset_188bytes = () => {
    let offset_value = document.getElementById("read_offset").value;
    read_offset = offset_value;
    cat_file_changed();
}

var next_188bytes= () => {
    read_offset += 188;
    document.getElementById("read_offset").value = read_offset;
    cat_file_changed();
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
    cat_from_text();
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

