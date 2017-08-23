
package com.ducduong.vcheck;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class ParseData {

	private static final String REACT_PUBLIC_RESOURCES_DATA_JSON =
		"/react/public/resources/data.json";

	@SuppressWarnings("unchecked")
	public static void main(String[] args) {

		InputStream is = ParseData.class.getResourceAsStream("/data.xlsx");

		@SuppressWarnings("resource")
		Workbook workbook = null;

		try {
			workbook = new XSSFWorkbook(is);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			Iterator<Row> iterator = datatypeSheet.iterator();

			// Skip header row
			iterator.next();

			JSONObject jsonObject = new JSONObject();
			JSONArray jsonArray = new JSONArray();

			while (iterator.hasNext()) {

				Row row = iterator.next();

				JSONObject rowJSONObj = new JSONObject();
				rowJSONObj.put("date", getCellValue(row.getCell(1)));
				rowJSONObj.put("time", getCellValue(row.getCell(2)));
				rowJSONObj.put("board", getCellValue(row.getCell(3)));
				rowJSONObj.put("violation", getCellValue(row.getCell(4)));
				rowJSONObj.put("location", getCellValue(row.getCell(5)));

				jsonArray.add(rowJSONObj);
			}

			String updateDate =
				(String) ((JSONObject) jsonArray.get(0)).get("date");
			System.out.println(
				"Num items:" + jsonArray.size() + ", " + updateDate);
			jsonObject.put("date", updateDate);
			jsonObject.put("items", jsonArray);

			String projectDir = System.getProperty("user.dir");
			File outFile =
				new File(projectDir + REACT_PUBLIC_RESOURCES_DATA_JSON);
			File parentDir = outFile.getParentFile();
			parentDir.mkdirs();

			FileWriter fileWriter = new FileWriter(outFile);
			fileWriter.write(jsonObject.toJSONString());
			fileWriter.flush();
			fileWriter.close();
		}
		catch (IOException e) {
			e.printStackTrace();
		}
		finally {
			try {
				is.close();
			}
			catch (Exception e) {
				e.printStackTrace();
			}

			try {
				if (workbook != null) {
					workbook.close();
				}
			}
			catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	@SuppressWarnings("deprecation")
	private static String getCellValue(Cell cell) {

		// cell.setCellType(Cell.CELL_TYPE_STRING);
		if (cell.getCellTypeEnum().equals(CellType.NUMERIC)) {
			DataFormatter df = new DataFormatter();
			String value = df.formatCellValue(cell);
			return value;
		}

		return cell.getStringCellValue();
	}
}
