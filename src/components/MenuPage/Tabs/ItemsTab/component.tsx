"use client";

import Card from "@/components/Cards/Card";
import Input from "@/components/FormControl/Input";
import { FilterIcon, SearchIcon } from "@/components/Icons";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import React from "react";
import { ItemsTabProps } from "./";
import { mockTiposCardapio } from "@/data/menuItems";
import Select from "@/components/FormControl/Select";
import ItemsItemCard from "./ItemsItemCard";
import { mockMenuItems } from "@/data/menus";

export function ItemsTab({ }: ItemsTabProps) {
  const {
    register,
    control,
    watch
  } = useForm<{ menuSearch: string; tipos: string }>({
    defaultValues: {
      menuSearch: "",
      tipos: mockTiposCardapio[0].value,
    },
  });

  const filters = watch()

  React.useEffect(() => {
    console.log(filters);
  }, [filters]);

  return (

    <Card>
      <Stack gap={{ xs: 1, sm: 2 }} direction={"row"}>
        <Input
          placeholder="Buscar por nome, matrícula..."
          icon={<SearchIcon />}
          register={register("menuSearch")}
        />

        <Select
          options={mockTiposCardapio}
          name="tipos"
          control={control}
          formControlSx={{ maxWidth: "250px" }}
        />

        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          sx={{ fontWeight: "400", minWidth: "120px" }}
          onClick={() => { }}
        >
          Filtrar
        </Button>
      </Stack>

      <Card>
        <Box>
          <Typography>Biblioteca de Itens</Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie os itens disponíveis para os cardápios ({mockMenuItems.length} {mockMenuItems.length > 1 ? "ativos" : "ativo"})
          </Typography>
        </Box>

        <Box
          display="grid"
          gap={{ xs: 1, sm: 2 }}
          gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"

        >
          {mockMenuItems.map((item, i) => (
            <ItemsItemCard
              key={i}
              item={item}
            />
          ))}
        </Box>
      </Card>

    </Card>
  );
}
