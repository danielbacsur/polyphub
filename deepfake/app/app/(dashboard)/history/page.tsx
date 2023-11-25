"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as Table from "@/components/ui/table";
import { useValidations } from "@/lib/hooks/use-validations";
import { timeAgo, valid } from "@/lib/utils";
import { type Tag, type Validation } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

export default function HistoryPage() {
  const validations = useValidations();

  const [validation, setValidation] = useState(validations[0]);

  return (
    <div className="h-full flex">
      <div className="flex-1 grid place-items-center p-4">
        <Table.Table>
          <Table.TableCaption>
            A list of your recent validations.
          </Table.TableCaption>
          <Table.TableHeader>
            <Table.TableRow>
              <Table.TableHead>Uploaded At</Table.TableHead>
              <Table.TableHead className="text-center">Status</Table.TableHead>
              <Table.TableHead className="text-right">Download</Table.TableHead>
            </Table.TableRow>
          </Table.TableHeader>
          <Table.TableBody>
            {validations.map((validation) => (
              <Table.TableRow
                key={validation.id}
                onClick={(event) => {
                  event.stopPropagation();

                  setValidation(validation);
                }}
              >
              
                <Table.TableCell>
                  {timeAgo(validation.createdAt)}
                </Table.TableCell>
                <Table.TableCell className="text-center">
                  {valid(validation.tags) ? (
                    <Badge>Valid</Badge>
                  ) : (
                    <Badge variant="destructive">
                      {validation.tags.length} Anomalies
                    </Badge>
                  )}
                </Table.TableCell>

                <Table.TableCell className="text-right">
                  <Button
                    variant="link"
                    className="px-0"
                    onClick={(event) => {
                      event.stopPropagation();

                      toast.success(`Downloaded! ${validation.id}}`);
                    }}
                  >
                    Download
                  </Button>
                </Table.TableCell>
              </Table.TableRow>
            ))}
          </Table.TableBody>
        </Table.Table>
      </div>

      <div className="flex-1 grid place-items-center p-4">
        {valid(validation.tags) ? (
          "Your video is valid!"
        ) : (
          <Table.Table>
            <Table.TableCaption>
              A list of your recent validations.
            </Table.TableCaption>
            <Table.TableHeader>
              <Table.TableRow>
                <Table.TableHead>Anomaly</Table.TableHead>
                <Table.TableHead className="text-right">At</Table.TableHead>
              </Table.TableRow>
            </Table.TableHeader>
            <Table.TableBody>
              {validation.tags.map((tag) => (
                <Table.TableRow key={tag.id}>
                  <Table.TableCell className="font-medium">
                    {tag.type}
                  </Table.TableCell>

                  <Table.TableCell className="text-right">
                    {tag.timestamp}
                  </Table.TableCell>
                </Table.TableRow>
              ))}
            </Table.TableBody>
          </Table.Table>
        )}
      </div>
    </div>
  );
}
